from django.apps import AppConfig


class GoHealthyAppConfig(AppConfig):
    name = 'Go_Healthy_App'

    def ready(self):
        from Go_Healthy_App.scheduletasks import runtasks
        #runtasks.start()
