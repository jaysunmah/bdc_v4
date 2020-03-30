from django.urls import re_path

from . import consumers
from backend.bluedresscapital.consumers import AddPortfolioConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
    re_path(r'ws/bdc/save_portfolio/(?P<job_uid>\w+)/$', AddPortfolioConsumer),
]