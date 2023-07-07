ARG PYTHON_VERSION=3.10-slim-buster
ARG DEBIAN_FRONTEND=noninteractive

FROM python:${PYTHON_VERSION}

ARG PORT
ENV PORT=$PORT

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN mkdir -p /code

WORKDIR /code

RUN cat /etc/*-release

#install the linux packages, since these are the dependencies of some python packages
RUN apt-get update --fix-missing && apt-get install -y \
    wget \
    openssl build-essential \
    libssl-dev \
    libxrender-dev \
    git-core \
    libx11-dev \
    libxext-dev \
    libfontconfig1-dev \
    libfreetype6 \
    libfreetype6-dev \
    libjpeg62-turbo \
    libpng16-16 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base \
    fontconfig \
    build-essential \
    libpq-dev \
    libpcre3-dev \
    curl \
    wget \
    gcc \
    cron \
    # wkhtmltopdf \
    gunicorn3 \
    && rm -rf /var/lib/apt/lists/* !
RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb
RUN dpkg -i wkhtmltox_0.12.6-1.buster_amd64.deb
RUN wkhtmltopdf --version
# RUN tar xvf wkhtmltox*.tar.xz
# RUN mv wkhtmltox/bin/wkhtmlto* /usr/bin

COPY requirements.txt /tmp/requirements.txt

RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt

COPY . /code

#public the port so that it can access over the internet
EXPOSE $PORT

RUN python manage.py makemigrations
RUN python manage.py migrate
RUN python manage.py collectstatic --noinput
RUN python manage.py crontab add

RUN chmod +x start.sh

CMD ["sh", "./start.sh"]