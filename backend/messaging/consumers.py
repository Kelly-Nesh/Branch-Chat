# Contains routing for websocket connections
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync as atos


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.group_name = self.scope["url_route"]["kwargs"]["group_name"]
        atos(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        """Leave group chat"""
        atos(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        """Receives"""
        text_json = json.loads(text_data)
        print(type(text_data), type(text_json))
        text_json["type"] = "group_message"


        atos(self.channel_layer.group_send)(self.group_name, text_json)
        print(text_json)

    def group_message(self, event):
        self.send(text_data=json.dumps({'message': event['message']}))
