#!/usr/bin/env sh

echo "Starting the web server................."
echo "Running release comands"
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py crontab add
python manage.py crontab show
crontab -l
# python manage.py runserver 0.0.0.0:$PORT
daphne GoHealthy.asgi:application -b 0.0.0.0 -p $PORT