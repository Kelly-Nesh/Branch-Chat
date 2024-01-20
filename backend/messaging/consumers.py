# Contains routing for websocket connections
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync as atos
from .models import Message


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.group_name = self.scope["url_route"]["kwargs"]["chat_id"]
        message = Message.objects.filter(conversation_id=self.group_name)\
            .order_by("-id").first()
        if message and message.complete:
            return
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
        text_json["type"] = "group_message"
        # print(text_json['complete'])
        atos(self.channel_layer.group_send)(self.group_name, text_json)
        if text_json.get('complete'):
            self.disconnect(None)

    def group_message(self, event):
        # print(event)
        self.send(text_data=json.dumps(event))
