import json
import jwt
from django.contrib.auth.models import User
from .models import CharacterSheet
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    # Connected users structure: {room_name: {user_id: {char_name, char_class, ...}}}
    connected_users = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Extract token from query string
        token = self.scope['query_string'].decode().split('token=')[-1]
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        # Extract user and character information from the decoded token
        user = await self.get_user_from_token(decoded_token)
        if user:
            self.scope['user'] = user  # Attach the user object to the scope
            print(user.id, user.char_name)
            user_id = user.id
            char_name = decoded_token.get('char_name', 'Unknown')  # Default to 'Unknown' if missing
            # Store character-specific data
            char_data = {
                'char_name': char_name,
            }
        else:
            # Reject connection if the token or user is invalid
            await self.close()
            return

        # Add user to the room's connected users
        if self.room_name not in ChatConsumer.connected_users:
            ChatConsumer.connected_users[self.room_name] = {}

        ChatConsumer.connected_users[self.room_name][user_id] = {
            'char_name': char_name,  # Use char_name instead of username
            **char_data,  # Add character-specific data
            'channel_name': self.channel_name,
        }

        # Join the WebSocket group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Notify the room of updated user list
        await self.broadcast_user_list()

    async def disconnect(self, close_code):
        user = self.scope.get('user')
        if user:
            user_id = user.id

            # Remove the user from the connected users list
            if self.room_name in ChatConsumer.connected_users:
                ChatConsumer.connected_users[self.room_name].pop(user_id, None)

            # Notify the room of updated user list
            await self.broadcast_user_list()

        # Leave the WebSocket group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'private_message':
            await self.handle_private_message(text_data_json)
        elif message_type == 'group_message':
            await self.handle_group_message(text_data_json)

    async def handle_private_message(self, data):
        recipient_id = data.get('recipient_id')
        message = data.get('message')
        sender_char_name = self.scope['user'].char_name  # Use char_name instead of username

        if not recipient_id or not message:
            return  # Ignore invalid private message requests

        recipient = ChatConsumer.connected_users[self.room_name].get(recipient_id)
        if recipient:
            await self.channel_layer.send(
                recipient['channel_name'],
                {
                    'type': 'private_message',
                    'message': message,
                    'sender': sender_char_name,  # Use char_name instead of sender username
                }
            )

    async def handle_group_message(self, data):
        message = data.get('message')
        char_name = self.scope['user'].char_name  # Use char_name instead of username

        if message:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'char_name': char_name,  # Use char_name instead of username
                }
            )

    async def chat_message(self, event):
        message = event['message']
        char_name = event['char_name']  # Use char_name instead of username

        # Send the group message to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'char_name': char_name,  # Use char_name instead of username
            'message': message,
        }))

    async def private_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send the private message to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'private_message',
            'sender': sender,
            'message': message,
        }))

    async def broadcast_user_list(self):
        if self.room_name in ChatConsumer.connected_users:
            # Send the updated user list to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_list',
                    'users': [
                        {
                            'char_name': u.get('char_name', 'Unknown'),  # Use char_name instead of username
                            'char_class': u.get('char_class', 'Unknown'),
                            'user_id': uid,
                        }
                        for uid, u in ChatConsumer.connected_users[self.room_name].items()
                    ],
                }
            )

    async def user_list(self, event):
        # Send the updated user list to the WebSocket
        users = event['users']
        await self.send(text_data=json.dumps({'type': 'user_list', 'users': users}))

    async def get_user_from_token(self, decoded_token):
        try:
            user_id = decoded_token.get('owner')
            user_name = decoded_token.get('char_name')
            if user_id:
                # Use sync_to_async to handle the DB query in the async context
                user = await sync_to_async(self.get_user_by_name)(user_name)
                return user
        except Exception as e:
            print(f"Error: {e}")
        return None

    def get_user_by_name(self, user_name):
        # This is the synchronous method that gets the user
        try:
            user = CharacterSheet.objects.get(char_name=user_name)
            return user
        except CharacterSheet.DoesNotExist:
            return None