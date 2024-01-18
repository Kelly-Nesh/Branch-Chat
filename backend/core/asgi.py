import os

from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.security.websocket import AllowedHostOriginValidator
from django.core.asgi import get_asgi_application
from messaging.routing import websocket_urlpatterns


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": asgi_app,
    "websocket": URLRouter(websocket_urlpatterns),
})
