from django_eventstream.channelmanager import DefaultChannelManager
from .models import *

class CustomChannelManager(DefaultChannelManager):
    def get_channels_for_request(self, request, view_kwargs):
        if 'user_specific-channels' in view_kwargs:
            channel = view_kwargs['user_specific-channels'][0]
            passedId = str(request.get_full_path()).split("/events/")[1].split("/")[0]
            channel = channel.format(username=request.user.username, id=passedId)
            return set([channel])
        elif 'channels' in view_kwargs:
            return set(view_kwargs['channels'])
        elif 'channel' in view_kwargs:
            return set([view_kwargs['channel']])
        else:
            return set(request.GET.getlist('channel'))
        
    #     #raise NotImplementedError()
    
    # def can_read_channel(self, user, channel):
    #     # require auth for prefixed channels
    #     if channel.startswith('_') and user is None:
    #         return False
    #     return True