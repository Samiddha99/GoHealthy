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
from django.conf import settings
import os
import django
from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer
from django.conf.urls import url
from django.urls import path, include
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import django_eventstream
#from Go_Healthy_App.channelmanager import CustomChannelManager


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GoHealthy.settings')

application = get_asgi_application()

application = ProtocolTypeRouter({
    'http': URLRouter([
        url(r'^events/live-notification/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'user_specific-channels': ['notification-{username}'] }),
        
        url(r'^events/now-book/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'user_specific-channels': ['nowBook-{username}'] }),
        
        url(r'^events/live-data/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveData'] }),
        
        url(r'^events/live-site-visitor/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveSiteVisitor'] }),
        
        url(r'^events/live-bed/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveBed'] }),

        url(r'^events/live-blood-status/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['liveBloodStatus'] }),

        url(r'^events/new-disease/', AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)), { 'channels': ['newDisease'] }),
        
        #url(r'^_try/', CustomChannelManager.get_channels_for_request, { 'format-channels': ['__customuser-{}'] }),
        
        url(r'', get_asgi_application()), 
    ]),
})


#channel_layer = get_channel_layer()