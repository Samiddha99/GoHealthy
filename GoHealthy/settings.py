"""
Django settings for GoHealthy project.
Generated by 'django-admin startproject' using Django 3.1.4.
For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os
import subprocess
from xmlrpc.client import Boolean
from django.db.models.expressions import F

from decouple import config, Csv
from dotenv import load_dotenv
import environ

import dj_database_url
from dj_database_url import parse as db_url

import django_heroku


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

env_file = BASE_DIR / '.env'
env = environ.Env()

SITE_ID = 1
DEBUG = config("DEBUG", default=False, cast=bool)
DEPLOY = config("DEPLOY", default=True, cast=bool)

SECRET_KEY = config("SECRET_KEY", cast=str)


# Application definition
INSTALLED_APPS = [
    'daphne',
    'channels',
    'django_eventstream',
    'clearcache',
    'Go_Healthy_App.apps.GoHealthyAppConfig',
    #'jet.dashboard',
    #'jet',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.sites',
    'django_user_agents',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'django.contrib.postgres',
    #'django_hstore',
    'django_admin_hstore_widget',
    'corsheaders',
    'rest_framework',
    'django_extensions',
    'sslserver',
    'django_cleanup',
    'django_dropbox_storage',
    'cache_headers',
    'django_crontab',
    'embed_video',
    'django_filters',
    'crispy_forms',
    'geoposition',
    'storages',
    'boto',
    'sri', #Subresource Integrity
]

BACKGROUND_TASK_RUN_ASYNC = True

JET_DEFAULT_THEME = 'light-gray'
JET_THEMES = [
    {
        'theme': 'default', # theme folder name
        'color': '#47bac1', # color of the theme's button in user menu
        'title': 'Default' # theme title
    },
    {
        'theme': 'green',
        'color': '#44b78b',
        'title': 'Green'
    },
    {
        'theme': 'light-green',
        'color': '#2faa60',
        'title': 'Light Green'
    },
    {
        'theme': 'light-violet',
        'color': '#a464c4',
        'title': 'Light Violet'
    },
    {
        'theme': 'light-blue',
        'color': '#5EADDE',
        'title': 'Light Blue'
    },
    {
        'theme': 'light-gray',
        'color': '#222',
        'title': 'Light Gray'
    }
]
JET_CHANGE_FORM_SIBLING_LINKS = True
JET_INDEX_DASHBOARD = 'jet.dashboard.dashboard.DefaultIndexDashboard'
JET_APP_INDEX_DASHBOARD = 'jet.dashboard.dashboard.DefaultAppIndexDashboard'

GEOPOSITION_GOOGLE_MAPS_API_KEY = config("GEOPOSITION_GOOGLE_MAPS_API_KEY")

OPENCAGEDATA_API = config('OPENCAGEDATA_API')

FAST2SMS_API_KEY = config("FAST2SMS_API_KEY")

TEXT_LOCAL_API = config("TEXT_LOCAL_API")

SENDGRID_API_KEY = config('SENDGRID_API_KEY')

SENDINBLUE_API_KEY = config('SENDINBLUE_API_KEY')

MAILJET_API_KEY = config('MAILJET_API_KEY')
MAILJET_API_SECRET = config('MAILJET_API_SECRET')
MAILJET_SMS_TOKEN = config('MAILJET_SMS_TOKEN')

TWO_FACTOR_API = config('TWO_FACTOR_API')

# Use this link to get AUTHORIZATION_CODE: https://www.dropbox.com/oauth2/authorize?client_id=<APP_KEY>&token_access_type=offline&response_type=code
# Use this to get OAUTH2_REFRESH_TOKEN: curl https://api.dropbox.com/oauth2/token -d code=<AUTHORIZATION_CODE> -d grant_type=authorization_code -d client_id=<APP_KEY> -d client_secret=<APP_SECRET>
DROPBOX_OAUTH2_ACCESS_TOKEN = config('DROPBOX_OAUTH2_ACCESS_TOKEN')
DROPBOX_OAUTH2_REFRESH_TOKEN = config('DROPBOX_OAUTH2_REFRESH_TOKEN')
DROPBOX_APP_KEY = config('DROPBOX_APP_KEY')
DROPBOX_APP_SECRET = config('DROPBOX_APP_SECRET')

GOOGLE_RECAPTCHA_SITE_KEY = config('GOOGLE_RECAPTCHA_SITE_KEY')
GOOGLE_RECAPTCHA_SECRET_KEY = config('GOOGLE_RECAPTCHA_SECRET_KEY')

ENGAGESPOT_API_KEY = config("ENGAGESPOT_API_KEY")

PUSHPAD_ACCESS_TOKEN = config("PUSHPAD_ACCESS_TOKEN")

ONESIGNAL_API_KEY = config("ONESIGNAL_API_KEY")

VIMEO_CLIENT_ID = config('VIMEO_CLIENT_ID')
VIMEO_CLIENT_SECRET = config('VIMEO_CLIENT_SECRET')
VIMEO_ACCESS_TOKEN = config('VIMEO_ACCESS_TOKEN')

REBRANDLY_API_KEY = config('REBRANDLY_API_KEY')

VPNAPI_KEY = config('VPNAPI_KEY')

DLT_ENTITY_ID = config('DLT_ENTITY_ID')
DLT_ENTITY_NAME = config('DLT_ENTITY_NAME')

try:
    WKHTMLTOPDF_BINARY_PATH = subprocess.run("which wkhtmltopdf", shell=True, capture_output=True, text=True).stdout
except:
    WKHTMLTOPDF_BINARY_PATH = subprocess.run("where wkhtmltopdf", shell=True, capture_output=True, text=True).stdout

SMS_SEND_ENABLED = config("SMS_SEND_ENABLED", '0')


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'csp.middleware.CSPMiddleware',  #Content-Secure-Policy Middleware
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'cache_headers.middleware.CacheHeadersMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.http.ConditionalGetMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_referrer_policy.middleware.ReferrerPolicyMiddleware',
    'django_grip.GripMiddleware',
    'django.middleware.common.BrokenLinkEmailsMiddleware',
    'django_ratelimit.middleware.RatelimitMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    # custom middleware
    # 'Go_Healthy_App.middleware.security.IPCheckMiddleware',
    'Go_Healthy_App.middleware.request_update.FormatPostData',
]


# Strict: Allowed on first party requests only. No cross-domain shenanigans
# Lax: Allowed on third party requests from safe top-level navigation (like, links or GET)
# None: Allowed on all first party and third party requests. Must also use the 'Secure' cookie attribute
ALLOWED_HOSTS = config('DOMAIN_NAME', default='127.0.0.1:8000', cast=Csv(str))
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='127.0.0.1:8000', cast=Csv(str))
MAIN_DOMAIN_NAME = config('DOMAIN_NAME', default='127.0.0.1:8000', cast=Csv(str))[0]
if DEPLOY:
    CSRF_COOKIE_SECURE = True  # browser trigger the cookie as safe, and only be send by secure connection.
    # CSRF_COOKIE_DOMAIN = MAIN_DOMAIN_NAME  # if set . before the domain name, then it also allow for subdomain.
    CSRF_COOKIE_NAME = '__Secure-csrftoken'
    CSRF_COOKIE_SAMESITE = 'Strict'
    CSRF_COOKIE_HTTPONLY = True
    CSRF_USE_SESSIONS = True
    
    SESSION_COOKIE_NAME = '__Secure-sessionid'
    SESSION_COOKIE_SECURE = True  # browser trigger the session cookie as safe, and only be send by secure connection.
    SESSION_COOKIE_SAMESITE = 'Strict'
    SESSION_COOKIE_HTTPONLY = True  # session cookies can only be access by https request.
    SESSION_EXPIRE_AT_BROWSER_CLOSE = False
    SESSION_COOKIE_AGE = 1 * 24 * 60 * 60  # 1 days in second
    # SESSION_COOKIE_DOMAIN = MAIN_DOMAIN_NAME  # if set . before the domain name, then it also allow for subdomain.
    SESSION_SAVE_EVERY_REQUEST = True
    
    SECURE_BROWSER_XSS_FILTER = True  # prevent rom xss attack. if true, filter all malicious files, scripts will be filtered.
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_HSTS_SECONDS = 1 * 365 * 24 * 60 * 60  # 365 days in second
    SECURE_REFERRER_POLICY = 'same-origin'
    # SECURE_SSL_REDIRECT = True  # if any http request come, then convert it to https if possible.
    
    APPEND_SLASH = True # append a slash after the url
    
    X_FRAME_OPTIONS = 'SAMEORIGIN'  # If the response contains the header with a value of SAMEORIGIN then the browser will only load the resource in a frame if the request originated from the same site. If the header is set to DENY then the browser will block the resource from loading in a frame no matter which site made the request.
    # Suppose an online store has a page where a logged in user can click “Buy Now” to purchase an item. A user has chosen to stay logged into the store all the time for convenience. An attacker site might create an “I Like Ponies” button on one of their own pages, and load the store’s page in a transparent iframe such that the “Buy Now” button is invisibly overlaid on the “I Like Ponies” button.
    # If the user visits the attacker’s site, clicking “I Like Ponies” will cause an inadvertent click on the “Buy Now” button and an unknowning purchase of the item.
    CORS_ALLOW_ALL_ORIGINS = False  # if False, CORS will be disabled, True means enabled. enable CORS is dangerous; because it allows other sites to do CORS into our site.
    CORS_ALLOWED_ORIGINS = [config('SITE_URL')]
    # CORS_PREFLIGHT_MAX_AGE = 60  # The number of seconds a client/browser can cache the preflight response.
    # CORS_ALLOW_METHODS = ['GET',]
    # CORS_ALLOW_METHODS = []
else:
    SECURE_HSTS_PRELOAD = False
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_SSL_REDIRECT = False
    CORS_ALLOWED_ORIGINS = []


REFERRER_POLICY = 'strict-origin' #Add referrer-policy
# #Content-Secure-Policy Configuration
context_processors = [
    'csp.context_processors.nonce'
]

CSP_DEFAULT_SRC = ["'self'"]

CSP_SCRIPT_SRC = [
    "'self'",
    "https://code.jquery.com/jquery-3.5.1.min.js",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js",
    "https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js",
    "https://maps.googleapis.com/maps/api/js",
    "https://www.google.com/recaptcha/",
    "https://www.google.com/recaptcha/api.js",
    "https://www.gstatic.com/recaptcha/ *",
    "https://translate.googleapis.com/ *",
    "https://polyfill.io/ *",
    "https://cdn.onesignal.com/sdks/OneSignalSDK.js",
    "https://cdn.anychart.com/ *",
    "https://code.jscharting.com/ *",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery.lazy/ *",
    "https://unpkg.com/@trevoreyre/autocomplete-js",
    "https://player.vimeo.com/api/player.js",
    "https://cdn.plyr.io/ *",
    "http://cdn.dashjs.org/latest/dash.all.min.js",
    "https://cdn.dashjs.org/latest/dash.all.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/hls.js/ *",
    "https://hammerjs.github.io/dist/hammer.min.js",
]
CSP_SCRIPT_SRC_ELEM = CSP_SCRIPT_SRC
CSP_SCRIPT_SRC_ATTR = ["'self'",]

CSP_STYLE_SRC = [
    "'self'",
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css",
    "https://fonts.googleapis.com/icon/ *",
    "https://fonts.googleapis.com/css/ *",
    "https://translate.googleapis.com/ *",
    "https://fonts.googleapis.com/ *",
    "https://ka-f.fontawesome.com/ *",
    "https://cdn.plyr.io/ *",
    "https://cdn.anychart.com/ *",
]
CSP_STYLE_SRC_ELEM = CSP_STYLE_SRC

CSP_IMG_SRC = [
    "'self'",
    "https://www.gstatic.com/images/branding/product/1x/translate_24dp.png",
    "https://www.gstatic.com/images/branding/product/2x/translate_24dp.png",
    "https://content.dropboxapi.com/ *",
    "data:",
    "blob:",
]

CSP_FONT_SRC = [
    "'self'",
    "https://fonts.gstatic.com/ *",
    "https://ka-f.fontawesome.com/ *",
    "https://cdn.anychart.com/ *"
]

CSP_CONNECT_SRC = [
    "'self'",
    "https://ka-f.fontawesome.com/ *",
    "https://internalapi.engagespot.co *",
]

CSP_FRAME_SRC = [
    "'self'",
    "https://www.google.com",
    "https://player.vimeo.com",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://cdn.anychart.com/ *",
    "https://export.anychart.com/",
    "https://www.google.com/recaptcha/",
    "https://recaptcha.google.com/recaptcha/",
]
CSP_MEDIA_SRC = [
    "'self'",
    "https://content.dropboxapi.com/ *",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
]
CSP_MANIFEST_SRC = [
    "'self'",
]
CSP_INCLUDE_NONCE_IN = ['script-src', 'style-src']
CSP_FRAME_ANCESTORS = ["'self'"]
CSP_BASE_URI = ["'self'"]
CSP_FORM_ACTION = ["'self'", "https://export.anychart.com/ *"]
CSP_OBJECT_SRC = ["'none'"]
CSP_UPGRADE_INSECURE_REQUESTS = True
CSP_BLOCK_ALL_MIXED_CONTENT = True

# CSP_REPORT_URI = [""]
# CSP_REPORT_ONLY = True


# if DEBUG:
#     INSTALLED_APPS += ['debug_toolbar']
#     MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
#     INTERNAL_IPS = ['127.0.0.1',]

WHITENOISE_SKIP_COMPRESS_EXTENSIONS = []

EVENTSTREAM_STORAGE_CLASS = 'django_eventstream.storage.DjangoModelStorage'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'template'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'Go_Healthy_App.context_processors.add_variable_to_context',
            ],
        },
    },
]

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'gohealthy-cache',
        'KEY_PREFIX:': 'GoHealthy',
        'TIMEOUT': None, # Use to cache never expire; to set limited time period set the time period in second
        'OPTIONS': {
            'MAX_ENTRIES': 1000
        }
    }
}

USER_AGENTS_CACHE = None

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": ['redis://localhost:6379'],
        },
        "ROUTING": "GoHealthy.routing.channel_routing",
    },
}


RATELIMIT_CACHE_PREFIX = "GoHealthy_rate_limit"
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = "default"
RATELIMIT_VIEW = 'Go_Healthy_App.views.rateLimitView'
DEFAULT_VIEW_RATE_LIMIT = '2000/h'


# WSGI_APPLICATION = 'GoHealthy.wsgi.application'
ASGI_APPLICATION = 'GoHealthy.asgi.application'
ROOT_URLCONF = 'GoHealthy.urls'
EVENTSTREAM_CHANNELMANAGER_CLASS = 'Go_Healthy_App.channelmanager.CustomChannelManager'


if DEPLOY:
    EVENTSTREAM_ALLOW_ORIGIN = config('SITE_URL')
    EVENTSTREAM_ALLOW_CREDENTIALS = True
    EVENTSTREAM_ALLOW_HEADERS = 'Authorization'
LOGIN_URL = '/login/'
PASSWORD_RESET_TIMEOUT = 600
LOGOUT_REDIRECT_URL = '/login/'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
if DEPLOY:
    DATABASES = {'default' : config('DATABASE_URL', cast=db_url)} # Parse database configuration from $DATABASE_URL
    DATABASES['default']['HAS_HSTORE'] = True
    DATABASES['default']['CONN_MAX_AGE'] = 600
    DATABASES['default']['CONN_HEALTH_CHECKS'] = True
else:
    DATABASES = {
        'default': {
            'ENGINE': config('POSTGRESQL_DATABASE_ENGINE'),
            'NAME': config('POSTGRESQL_DATABASE_NAME'),
            'USER': config('POSTGRESQL_DATABASE_USER'),
            'PASSWORD': config('POSTGRESQL_DATABASE_PASSWORD'),
            'HOST': config('POSTGRESQL_DATABASE_HOST'),
            'PORT': config('POSTGRESQL_DATABASE_PORT'),
            'HAS_HSTORE': True,
            'OPTIONS': {
                'options': '-c search_path=go_healthy_schema,django,public'
            },
        }
    }

AUTH_USER_MODEL = 'Go_Healthy_App.Users'

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}


# configure cron jobs
CRONTAB_LOCK_JOBS = True # prevent starting a job if an old instance of the same job is still running
CRONTAB_EXECUTABLE = config('CRONTAB_EXECUTABLE_PATH', '/usr/bin/crontab') # path to the crontab executable of your os
CRONJOBS = [
    ('*/1 * * * *', 'Go_Healthy_App.scheduletasks.tasks.deleteOTP', '>> /logs/scheduled_job/deleteOTP.log'),
    ('*/1 * * * *', 'Go_Healthy_App.scheduletasks.tasks.deleteResetLink', '>> /logs/scheduled_job/deleteResetLink.log'),
    ('*/5 * * * *', 'Go_Healthy_App.scheduletasks.tasks.sendBloodDonationCampReminder', '>> /logs/scheduled_job/sendBloodDonationCampReminder.log'),
    ('*/1 * * * *', 'Go_Healthy_App.scheduletasks.tasks.bookExpireAlert', '>> /logs/scheduled_job/bookExpireAlert.log'),
    ('*/1 * * * *', 'Go_Healthy_App.scheduletasks.tasks.expireBooking', '>> /logs/scheduled_job/expireBooking.log'),
    ('*/1 * * * *', 'Go_Healthy_App.scheduletasks.tasks.unreserveBed', '>> /logs/scheduled_job/unreserveBed.log'),
    ('*/60 * * * *', 'Go_Healthy_App.scheduletasks.tasks.multipleBookingWarning', '>> /logs/scheduled_job/multipleBookingWarning.log'),
    ('* * */30 * *', 'Go_Healthy_App.scheduletasks.tasks.deleteBloodRequest', '>> /logs/scheduled_job/deleteBloodRequest.log'),
    ('* * */30 * *', 'Go_Healthy_App.scheduletasks.tasks.deleteBloodDonationCamps', '>> /logs/scheduled_job/deleteBloodDonationCamps.log'),
    ('* * */1 * *', 'Go_Healthy_App.scheduletasks.tasks.deletePastPatientRecords', '>> /logs/scheduled_job/deletePastPatientRecords.log'),
    ('* * */1 * *', 'Go_Healthy_App.scheduletasks.tasks.deleteContactUs', '>> /logs/scheduled_job/deleteContactUs.log'),
    ('* * */1 * *', 'Go_Healthy_App.scheduletasks.tasks.deleteFeedback', '>> /logs/scheduled_job/deleteFeedback.log'),
    ('5 00 * * *', 'Go_Healthy_App.scheduletasks.tasks.donorDowngradeMessage', '>> /logs/scheduled_job/donorDowngradeMessage.log'),
    ('10 00 * * *', 'Go_Healthy_App.scheduletasks.tasks.deleteNonVerifyUser', '>> /logs/scheduled_job/deleteNonVerifyUser.log'),
    ('00 00 * * *', 'Go_Healthy_App.scheduletasks.tasks.resetLiveData', '>> /logs/scheduled_job/resetLiveData.log'),
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'assets/staticfiles'  # The command manage.py collectstatic will automatically compile all the static files throughout the project and dump it into a single root directory, which is declared in STATIC_ROOT
STATICFILES_DIRS = [BASE_DIR / 'assets/static/', ]

MEDIA_ROOT = BASE_DIR / 'assets/media/'
MEDIA_URL = '/media/'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
if DEPLOY:
    DEFAULT_FILE_STORAGE = 'custom_storages.backends.dropbox.DropBoxStorage'
    DROPBOX_ROOT_PATH = '/assets/media/'


#For Mail Sending
DEFAULT_FROM_EMAIL = config("GOOGLE_EMAIL_ID")
SERVER_EMAIL = config("GOOGLE_EMAIL_ID")

ADMINS = [
    (config("SENDGRID_EMAIL_SENDER_NAME"), config("GOOGLE_EMAIL_ID")),
]  # send error to this mail
MANAGERS = ADMINS

EMAIL_BACKEND = config("EMAIL_BACKEND")
EMAIL_HOST = config("SENDGRID_EMAIL_HOST")
EMAIL_USE_TLS = True

#EMAIL_USE_SSL = True
EMAIL_PORT = config("SENDGRID_EMAIL_TLS_PORT1", cast=int)
EMAIL_ID = config("GOOGLE_EMAIL_ID")
EMAIL_HOST_NAME = config("SENDGRID_EMAIL_SENDER_NAME")
EMAIL_HOST_USER = config("SENDGRID_EMAIL_HOST_USERNAME")
EMAIL_HOST_PASSWORD = config("SENDGRID_EMAIL_HOST_PASSWORD")

ADMIN_URL = config('ADMIN_URL')

SITE_URL = config('SITE_URL')


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

USE_TZ = False

TIME_ZONE = 'Asia/Calcutta'

USE_I18N = True

USE_L10N = False # The default formatting to use for displaying datetime fields in any part of the system. Note that if USE_L10N is set to True, then the locale-dictated format has higher precedence and will be applied instead.
                # A boolean that specifies if localized formatting of data will be enabled by default or not. If this is set to True, e.g. Django will display numbers and dates using the format of the current locale.


DATE_INPUT_FORMATS = [
    '%d %B %Y',  # '25 October 2006'
    '%d %B, %Y',  # '25 October, 2006'
    '%d %b %Y',  # '25 Oct 2006'
    '%d %b, %Y',  # '25 Oct, 2006'
    '%b %d %Y',  # 'Oct 25 2006'
    '%b %d, %Y',  # 'Oct 25, 2006'
    '%B %d %Y',  # 'October 25 2006'
    '%B %d, %Y',  # 'October 25, 2006'
    '%m/%d/%Y',  # '10/25/2006'
    '%m-%d-%Y',  # '10-25-2006'
    '%m/%d/%y',  # '10/25/06'
    '%Y-%m-%d',  # '2006-10-25'
] # A list of formats that will be accepted when inputting data on a date field. Formats will be tried in order, using the first valid one.
TIME_INPUT_FORMATS = [
    '%I:%M:%S %p',  # '01:30:59 PM'
    '%I:%M %p', # '01:30 PM'
    '%I:%M:%S.%f %p',  # '01:30:59.000200 PM'
    '%H:%M:%S', # '14:30:59'
    '%H:%M', # '14:30'
    '%H:%M:%S.%f', # '14:30:59.000200'
] # A list of formats that will be accepted when inputting data on a time field. Formats will be tried in order, using the first valid one.
DATETIME_INPUT_FORMATS = [
    '%d %B %Y, %I:%M:%S %p',  # '25 October 2006, 01:30:59 PM'
    '%d %B %Y, %I:%M %p',  # '25 October 2006, 01:30 PM'
    '%d %B %Y, %I:%M:%S.%f %p',  # '25 October 2006, 01:30:59.000200 PM'
    '%d %B %Y, %H:%M:%S',  # '25 October 2006, 14:30:59'
    '%d %b %Y, %I:%M %p'  # '25 Oct 2006, 01:30 PM'
    '%d %b %Y, %I:%M:%S %p'  # '25 Oct 2006, 01:30:59 PM'
    '%b %d %Y, %I:%M %p',  # 'Oct 25 2006, 01:30 PM'
    '%b %d %Y, %I:%M:%S %p',  # 'Oct 25 2006, 01:30:59 PM'
    '%B %d %Y, %I:%M %p',  # 'October 25 2006, 01:30 PM'
    '%B %d %Y, %I:%M:%S %p',  # 'October 25 2006, 01:30:59 PM'
    '%d/%m/%Y, %I:%M %p',  # '25/10/2006, 01:30 PM'
    '%d/%m/%Y, %I:%M:%S %p',  # '25/10/2006, 01:30:59 PM'
    '%d-%m-%Y, %I:%M %p',  # '25-10-2006, 01:30 PM'
    '%d-%m-%Y, %I:%M:%S %p',  # '25-10-2006, 01:30:59 PM'
    '%d/%m/%y, %I:%M %p',  # '25/10/06, 01:30 PM'
    '%d/%m/%y, %I:%M:%S %p',  # '25/10/06, 01:30:59 PM'
    '%Y-%m-%d, %I:%M %p',  # '2006-10-25, 01:30 PM'
    '%Y-%m-%d, %I:%M:%S %p',  # '2006-10-25, 01:30:59 PM'
] # A list of formats that will be accepted when inputting data on a datetime field. Formats will be tried in order, using the first valid one.

# Date and Time format for template
DATE_FORMAT = 'd F Y'  # '25 October 2006'
SHORT_DATE_FORMAT = 'd M y'  # '25 Oct 21'
DATETIME_FORMAT = 'd F Y, h:i A'  # '25 October 2006, 01:30 PM'
SHORT_DATETIME_FORMAT = 'd M y, h:i A'  # '25 Oct 06, 01:30 PM'
TIME_FORMAT = 'h:i A' # '01:30 PM

# 2.5MB - 2621440
# 5MB - 5242880
# 10MB - 10485760
# 20MB - 20971520
# 50MB - 5242880
# 100MB 104857600
# 250MB - 214958080
# 500MB - 429916160
MAX_UPLOAD_SIZE = 104857600 # 100 MB
CONTENT_TYPES = ['image/+', 'video/+', 'audio/+', 'text/+', 'application/pdf', 'application/msword', 'application/vnd+']
DOCUMENT_CONTENT_TYPES = ['image/+', 'application/pdf']

# if DEPLOY:
#     django_heroku.settings(locals())