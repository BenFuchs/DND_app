import json
import jwt
from django.contrib.auth.models import User
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    # {room_name: {user_id: {username, channel_name}}}
    connected_users = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Extract token from query string
        token = self.scope['query_string'].decode().split('token=')[-1]

        # Retrieve the user and user ID from the token
        user = await self.get_user_from_token(token)
        user_id = await self.get_user_id_from_token(token)

        if user:
            self.scope['user'] = user  # Set the user in the scope
        else:
            # Reject the connection if the user is not valid
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Add user to the connected users dictionary
        if self.room_name not in ChatConsumer.connected_users:
            ChatConsumer.connected_users[self.room_name] = {}

        ChatConsumer.connected_users[self.room_name][user_id] = {
            'username': user.username,
            'channel_name': self.channel_name,
        }

        # Notify the group about the updated user list
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_list',
                'users': [
                    {'username': u['username'], 'user_id': uid}
                    for uid, u in ChatConsumer.connected_users[self.room_name].items()
                ],
            }
        )

    async def get_user_id_from_token(self, token: str):
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return decoded_token.get('user_id')  # Assuming 'user_id' is in the token
        except jwt.ExpiredSignatureError:
            print("Token has expired")
        except jwt.InvalidTokenError:
            print("Invalid token")
        return None

    async def get_user_from_token(self, token: str):
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_token.get('user_id')
            if user_id:
                return await sync_to_async(User.objects.get)(id=user_id)
        except jwt.ExpiredSignatureError:
            print("Token has expired")
        except jwt.InvalidTokenError:
            print("Invalid token")
        return None

    async def disconnect(self, close_code):
        user = self.scope['user']
        user_id = await sync_to_async(lambda: user.id)()

        # Remove user from connected users
        if self.room_name in ChatConsumer.connected_users:
            ChatConsumer.connected_users[self.room_name].pop(user_id, None)

        # Notify the group about the updated user list
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_list',
                'users': [
                    {'username': u['username'], 'user_id': uid}
                    for uid, u in ChatConsumer.connected_users[self.room_name].items()
                ],
            }
        )

        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def user_list(self, event):
        users = event['users']
        await self.send(text_data=json.dumps({'type': 'user_list', 'users': users}))

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'private_message':
            recipient_id = text_data_json['recipient_id']
            message = text_data_json['message']
            sender_username = self.scope['user'].username

            # Find recipient in connected users
            recipient = ChatConsumer.connected_users[self.room_name].get(recipient_id)
            if recipient:
                await self.channel_layer.send(
                    recipient['channel_name'],
                    {
                        'type': 'private_message',
                        'message': message,
                        'sender': sender_username,
                    }
                )
        else:
            # Handle group message
            message = text_data_json['message']
            username = self.scope['user'].username
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                }
            )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'username': username,
            'message': message,
        }))

    async def private_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'type': 'private_message',
            'sender': sender,
            'message': message,
        }))
