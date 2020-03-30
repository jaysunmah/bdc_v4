import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import time

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print("Message! " + message)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        print("Chat_messsage: " + message)

        for i in range(5):
            print("ack")
            # Send message to WebSocket
            self.send(text_data=json.dumps({
                'status': 'in_progress',
                'message': 'Iter: ' + str(i)
            }))
            time.sleep(1)
        print("donezo")
    # Send message to WebSocket
        self.send(text_data=json.dumps({
            'status': 'done',
            'message': 'It is not prime.'
        }))