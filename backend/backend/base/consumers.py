import json
import jwt
from django.contrib.auth.models import User
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Extract token from query parameters
        token = self.scope.get('query_string', b'').decode().split('=')[-1]

        # Retrieve the user from the token
        user = await self.get_user_from_token(token)

        if user:
            self.scope['user'] = user
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def get_user_from_token(self, token: str):
        try:
            # Decode the JWT token using the secret key
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # Get user id or username from decoded token
            user_id = decoded_token.get('user_id')  # Assuming 'user_id' is in the token
            
            if not user_id:
                return None  # Return None if there's no user_id in the token

            # Look up the user in the database
            user = await sync_to_async(User.objects.get)(id=user_id)
            return user
        
        except jwt.ExpiredSignatureError:
            # Handle expired token
            print("Token has expired")
            return None
        
        except jwt.InvalidTokenError:
            # Handle invalid token
            print("Invalid token")
            return None

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = self.scope.get('user', None).username if self.scope.get('user') else 'Anonymous'

        # Send message to room group, including the sender's username
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username  # Add the username of the sender here
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']  # Extract the sender's username from the event

        # Send message to WebSocket with the correct sender's username
        await self.send(text_data=json.dumps({
            'username': username,  # Use the username of the sender here
            'message': message
        }))