import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from backend.bluedresscapital.portfolio_apis import create_and_load_portfolio

class AddPortfolioConsumer(WebsocketConsumer):
    def connect(self):
        self.job_uid = self.scope['url_route']['kwargs']['job_uid']
        async_to_sync(self.channel_layer.group_add)(
            self.job_uid,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.job_uid,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.job_uid,
            {
                'type': 'create_portfolio',
                'token': data['token'],
                'nickname': data['nickname'],
                'brokerage': data['brokerage']
            }
        )
    # Receive message from room group
    def create_portfolio(self, event):
        create_and_load_portfolio(event['token'], event['nickname'], event['brokerage'], self)

    def update_status(self, msg):
        self.send_status('in_progress', msg)

    def mark_error(self, error):
        self.send_status('error', error)

    def send_status(self, status, msg):
        self.send(text_data=json.dumps({
            'status': status,
            'message': msg
        }))

    def mark_done(self, port, port_id):
        self.send(text_data=json.dumps({
            'status': 'done',
            'new_portfolio': port,
            'port_id': port_id
        }))

