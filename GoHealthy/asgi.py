"""
ASGI config for GoHealthy project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GoHealthy.settings')
from django.core.asgi import get_asgi_application
django.setup()
django_asgi_app = get_asgi_application()

from django.urls import path, include, re_path
from django.conf import settings
import django
from channels.layers import get_channel_layer
from django.conf.urls import url
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import django_eventstream
#from Go_Healthy_App.channelmanager import CustomChannelManager


# application = get_asgi_application()

application = ProtocolTypeRouter({
    'http': URLRouter([
        path('events/live-notification/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'user_specific-channels': ['notification-{username}'] }),
        
        path('events/now-book/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'user_specific-channels': ['nowBook-{username}'] }),
        
        path('events/live-data/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveData'] }),
        
        path('events/live-site-visitor/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveSiteVisitor'] }),
        
        path('events/live-bed/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveBed'] }),

        path('events/live-blood-status/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveBloodStatus'] }),

        path('events/new-disease/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['newDisease'] }),
        
        #url(r'^_try/', CustomChannelManager.get_channels_for_request, { 'format-channels': ['__customuser-{}'] }),
        
        re_path(r'', django_asgi_app),
    ]),
})


# channel_layer = get_channel_layer()