from django.conf import settings
from django.apps import AppConfig
from django.core.cache import cache
from django.db import connection
import os


class GoHealthyAppConfig(AppConfig):
    name = 'Go_Healthy_App'

    def ready(self):
        print('Starting web server.....')
        try:
            cache.clear()

            """
            Always create PostgreSQL HSTORE extension if it doesn't exist on the database before syncing the database.
            HSTORE extension is used to store key-value data on database.
            Requires PostgreSQL 9.1 or newer.
            """
            cursor = connection.cursor()
            cursor.execute("CREATE EXTENSION IF NOT EXISTS hstore")

            # from Go_Healthy_App.scheduletasks import tasks
            # tasks.startSchedule()

            if not os.path.exists(settings.STATIC_ROOT):
                os.makedirs(settings.STATIC_ROOT)

            from Go_Healthy_App import add_all_data
            add_all_data.addStates()
            add_all_data.addDegrees()
            add_all_data.addLanguages()
            add_all_data.addDepartments()
            add_all_data.addSomeCommonDisease()
        except Exception as e:
            print(f" ! {e}")
