ARG PYTHON_VERSION=3.10-slim-buster
ARG DEBIAN_FRONTEND=noninteractive

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN mkdir -p /code

WORKDIR /code

#install the linux packages, since these are the dependencies of some python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libpcre3-dev \
    curl \
    gcc \
    cron \
    wkhtmltopdf \
    gunicorn3
    # && rm -rf /var/lib/apt/lists/* !

COPY requirements.txt /tmp/requirements.txt

RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt

COPY . /code

#public the port so that it can access over the internet
#EXPOSE 8000

RUN python manage.py makemigrations
RUN python manage.py migrate
# RUN python manage.py collectstatic --noinput
RUN python manage.py crontab add

RUN chmod +x start.sh

CMD ["sh", "./start.sh"]