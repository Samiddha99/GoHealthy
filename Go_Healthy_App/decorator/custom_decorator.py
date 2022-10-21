from urllib import response
from django.http import HttpResponse
from django.shortcuts import render, redirect
from Go_Healthy_App.utils import *



def exempt_IPCheckMiddleware(func):
    """ view decorator, the sole purpose to is 'rename' the function to
    '_exempt_IPCheckMiddleware'.
    So we can identify functions those name is '_exempt_IPCheckMiddleware', to skip this view function from IPCheckMiddleware"""

    def _exempt_IPCheckMiddleware(*args, **kwargs):
        return func(*args, **kwargs)

    # copiedFunc = func
    # copiedFunc.__name__ = '_exempt_IPCheckMiddleware'
    return _exempt_IPCheckMiddleware


def prevent_anonymous_ip(func, block_vpn=True, block_proxy=True, block_tor=True, block_relay=True):
    def innerFunction(*args, **kwargs):
        request = args[0]
        client_ip, is_routable = get_client_ip(request)
        userIp = getUserIpInfo(client_ip)
        security = userIp.get('security', {})
        if ((security.get('vpn') == True and block_vpn == True) or (security.get('proxy') == True and block_proxy == True) or (security.get('tor') == True and block_tor == True) or (security.get('relay') == True and block_relay == True)):
            return HttpResponse("<h1>We can't allow your request, because you are using VPN or Proxy or Tor or Relay.</h1>", status=418)
        else:
            return func(*args, **kwargs)
    return innerFunction