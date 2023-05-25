#!/usr/bin/env sh

echo "Starting the web server................."
# python manage.py makemigrations
# python manage.py migrate
# python manage.py create_static_root
# python manage.py collectstatic --noinput
# python manage.py crontab add
# python manage.py add_all_data
# python manage.py runserver 0.0.0.0:$PORT
daphne GoHealthy.asgi:application -b 0.0.0.0 -p $PORT --access-log - --websocket_timeout -1 --websocket_connect_timeout 20 --http-timeout 20