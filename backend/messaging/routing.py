from django.urls import path
from . import consumers


websocket_urlpatterns = [
    path("ws/support/<str:group_name>/", consumers.ChatConsumer.as_asgi()),
    path("ws/agent/support/<str:group_name>/",
            consumers.ChatConsumer.as_asgi()),
]