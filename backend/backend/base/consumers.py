import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.sessions.models import Session
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Check session for room access
        session = self.scope.get('session', {})
        room_access_key = f'room_{self.room_name}_access_granted'

        if session.get(room_access_key):
            # User has access to the room
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name,

            )
            await self.accept()
        else:
            # Close connection if no access
            await self.close()

    async def disconnect(self, close_code):
        # Leave the room group on disconnect
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive a message from WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    async def chat_message(self, event):
        # Receive a message from the room group
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))
