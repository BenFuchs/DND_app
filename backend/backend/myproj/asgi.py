import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from base.routing import websocket_urlpatterns  # Import routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

# Django ASGI application to handle HTTP
django_asgi_app = get_asgi_application()

# WebSocket routing
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
