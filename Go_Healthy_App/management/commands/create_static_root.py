from django.core.management.base import BaseCommand, CommandError
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Create data'
    def handle(self, *args, **kwargs):
        if not os.path.exists(settings.STATIC_ROOT):
            os.makedirs(settings.STATIC_ROOT)
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)