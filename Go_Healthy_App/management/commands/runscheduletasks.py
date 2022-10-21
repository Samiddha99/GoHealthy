from django.core.management.base import BaseCommand, CommandError
from Go_Healthy_App.scheduletasks import tasks

class Command(BaseCommand):
    help = 'Run all defined schedule tasks'
    def handle(self, *args, **kwargs):
        tasks.startSchedule()