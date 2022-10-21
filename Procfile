web: gunicorn GoHealthy.wsgi --log-file - --log-level 'error' --preload --max-requests 1200 --timeout 30 --keep-alive 30
clock: python manage.py runscheduletasks

# web: daphne GoHealthy.asgi --port $PORT --bind 0.0.0.0
# worker: python manage.py runworker