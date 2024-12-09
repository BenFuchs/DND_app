import json
import jwt
from enum import Enum
from django.conf import settings
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *
import traceback


class RaceSheets(Enum):
    HumanSheets = 1
    GnomeSheets = 2
    ElfSheets = 3
    HalflingSheets = 4

class ChatConsumer(AsyncWebsocketConsumer):
    # Connected users structure: {room_name: {user_id: {char_name, race, channel_name}}}
    connected_users = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Extract token from query string
        token = self.scope['query_string'].decode().split('token=')[-1]
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        user = await self.get_user_from_token(decoded_token)
        if user:
            self.scope['user'] = user
            user_id = user.id
            char_name = decoded_token.get('char_name', 'Unknown')
            user_race = user.race
            char_data = {'char_name': char_name, 'race': user_race}
        else:
            await self.close()
            return

        if self.room_name not in ChatConsumer.connected_users:
            ChatConsumer.connected_users[self.room_name] = {}

        ChatConsumer.connected_users[self.room_name][user_id] = {
            **char_data,
            'channel_name': self.channel_name,
        }

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.broadcast_user_list()

    async def disconnect(self, close_code):
        user = self.scope.get('user')
        if user:
            user_id = user.id
            if self.room_name in ChatConsumer.connected_users:
                ChatConsumer.connected_users[self.room_name].pop(user_id, None)
            await self.broadcast_user_list()
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'private_message':
            await self.handle_private_message(text_data_json)
        elif message_type == 'group_message':
            await self.handle_group_message(text_data_json)
        elif message_type == 'gold_transfer':
            await self.handle_gold_transfer(text_data_json)
        elif message_type == 'handle_gold_transfer_error':  # Fix here: match the correct type name
            await self.handle_gold_transfer_error(text_data_json)
      
    async def handle_private_message(self, data):
        recipient_id = data.get('recipient_id')
        message = data.get('message')
        sender_char_name = self.scope['user'].char_name

        if not recipient_id or not message:
            return

        recipient = ChatConsumer.connected_users[self.room_name].get(recipient_id)
        if recipient:
            await self.channel_layer.send(
                recipient['channel_name'],
                {
                    'type': 'private_message',
                    'message': message,
                    'sender': sender_char_name,
                }
            )

    async def handle_group_message(self, data):
        message = data.get('message')
        char_name = self.scope['user'].char_name

        if message:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'char_name': char_name,
                }
            )

    async def handle_gold_transfer_error(self, event):
        await self.send(text_data=json.dumps({
            'type': 'handle_gold_transfer_error',  # Fix here to ensure the message type matches
            'error_message': event,
        }))

    async def handle_gold_transfer(self, data):
        sender_id = self.scope['user'].id
        recipient_id = data.get('recipient_id')
        amount = data.get('amount')

        if not recipient_id or not amount or amount <= 0:
            await self.channel_layer.send(self.channel_name, {
                'type': 'handle_gold_transfer_error',  # Fix here: match the correct type name
                'error_message': 'Invalid transfer data. Please check the recipient and amount.',
            })
            return

        sender = ChatConsumer.connected_users[self.room_name].get(sender_id)
        recipient = ChatConsumer.connected_users[self.room_name].get(recipient_id)

        if sender and recipient:
            sender_race = sender.get('race')  # e.g., 1 for HumanSheets, 2 for GnomeSheets
            sender_char_name = sender.get('char_name')
            recipient_race = recipient.get('race')
            recipient_char_name = recipient.get('char_name')

            race_models = {
                'HumanSheets': HumanSheets,
                'GnomeSheets': GnomeSheets,
                'ElfSheets': ElfSheets,
                'HalflingSheets': HalflingSheets,
            }

            try:
                # Validate that sender_race and recipient_race are valid integer keys in the RaceSheets enum
                if sender_race not in [race.value for race in RaceSheets]:    
                    raise ValueError(f"Invalid sender race: {sender_race}")
                if recipient_race not in [race.value for race in RaceSheets]:
                    raise ValueError(f"Invalid recipient race: {recipient_race}")

                sender_race_model_name = RaceSheets(sender_race).name
                recipient_race_model_name = RaceSheets(recipient_race).name

                sender_race_model = race_models.get(sender_race_model_name)
                recipient_race_model = race_models.get(recipient_race_model_name)

                if not sender_race_model or not recipient_race_model:
                    raise ValueError("Invalid race model.")

                sender_race_sheet = await self.get_race_sheet_model(sender_race_model, sender_char_name)
                recipient_race_sheet = await self.get_race_sheet_model(recipient_race_model, recipient_char_name)

                sender_gold = sender_race_sheet.char_gold
                recipient_gold = recipient_race_sheet.char_gold
                
                if sender_gold < amount:
                    await self.handle_gold_transfer_error(event={'error_message': 'Not enough gold'})

                if sender_gold >= amount:
                    await self.update_race_sheet_gold(sender_race_sheet, sender_gold - amount)
                    await self.update_race_sheet_gold(recipient_race_sheet, recipient_gold + amount)

                    await self.channel_layer.send(
                        sender['channel_name'],
                        {
                            'type': 'gold_transfer',
                            'recipient_id': recipient_id,
                            'amount': amount,
                            'sender': sender_char_name,
                            'recipient_char_name': recipient_char_name,
                            'balance': sender_gold - amount,
                        }
                    )
                    await self.channel_layer.send(
                        recipient['channel_name'],
                        {
                            'type': 'gold_transfer',
                            'sender_id': sender_id,
                            'amount': amount,
                            'sender': sender_char_name,
                            'recipient_char_name': recipient_char_name,
                            'balance': recipient_gold + amount,
                        }
                    )
                else:
                    await self.channel_layer.send(
                        sender['channel_name'],
                        {
                            'type': 'handle_gold_transfer_error',  # Fix here: match the correct type name
                            'message': 'Not enough gold to complete the transfer.',
                        }
                    )
            except Exception as e:
                print(f"Error in gold handle: {str(e)}")

    async def private_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'type': 'private_message',
            'sender': sender,
            'message': message,
        }))

    async def chat_message(self, event):
        message = event['message']
        char_name = event['char_name']

        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'char_name': char_name,
            'message': message,
        }))

    async def gold_transfer(self, event):
        recipient_id = event.get('recipient_id')
        amount = event.get('amount')
        sender = event.get('sender')
        balance = event.get('balance')

        await self.send(text_data=json.dumps({
            'type': 'gold_transfer',
            'recipient_id': recipient_id,
            'amount': amount,
            'sender': sender,
            'balance': balance,
        }))

    async def broadcast_user_list(self):
        if self.room_name in ChatConsumer.connected_users:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_list',
                    'users': [
                        {'char_name': u.get('char_name', 'Unknown'), 'user_id': uid}
                        for uid, u in ChatConsumer.connected_users[self.room_name].items()
                    ],
                }
            )

    async def user_list(self, event):
        users = event['users']
        await self.send(text_data=json.dumps({'type': 'user_list', 'users': users}))

    @sync_to_async
    def get_race_sheet_model(self, race_model, char_name):
        return race_model.objects.get(char_name=char_name)

    @sync_to_async
    def update_race_sheet_gold(self, race_sheet, new_gold):
        race_sheet.char_gold = new_gold
        race_sheet.save()

    async def get_user_from_token(self, decoded_token):
        try:
            user_id = decoded_token.get('owner')
            user_name = decoded_token.get('char_name')
            if user_id:
                return await sync_to_async(self.get_user_by_name)(user_name)
        except Exception as e:
            print(f"Error: {e}")
        return None

    def get_user_by_name(self, user_name):
        try:
            return CharacterSheet.objects.get(char_name=user_name)
        except CharacterSheet.DoesNotExist:
            return None
