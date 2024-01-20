from django.urls import path
from . import consumers


websocket_urlpatterns = [
    path("ws/support/<str:chat_id>/", consumers.ChatConsumer.as_asgi()),
]
