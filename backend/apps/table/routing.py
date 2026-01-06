from .consumers import TableStatusUpdateConsumer
from django.urls import path


websocket_urlpatterns = [
    path('ws/tables/', TableStatusUpdateConsumer.as_asgi()),
]