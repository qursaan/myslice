import os.path
import logging
import subprocess


logger = logging.getLogger('myslice')

# ROOT
try:
    ROOT = os.path.realpath(os.path.dirname(__file__) + '/..')
except:
    import traceback
    logger.error(traceback.format_exc())


from myslice.configengine import ConfigEngine

config = ConfigEngine()

import myslice.components as components

# import djcelery
# djcelery.setup_loader()

### detect if we're in a build environment
try:
    import manifold
    building=False
except:
    building=True

if not config.myslice.portal_version:
    try:
        PORTAL_VERSION = subprocess.check_output(["git", "describe"])
    except:
        PORTAL_VERSION = 'not using git' 

# DEBUG
if config.myslice.debug :
    DEBUG = True
    INTERNAL_IPS = ("127.0.0.1","132.227.84.195","132.227.78.191","132.227.84.191")
else :
    DEBUG = False

# theme
if config.myslice.theme :
    theme = config.myslice.theme
else :
    theme = None

if config.myslice.theme_label :
    theme_label = config.myslice.theme_label
else :
    theme_label = theme

if config.myslice.theme_logo :
    theme_logo = config.myslice.theme_logo
else :
    theme_logo = theme + '.png'

# HTTPROOT
if config.myslice.httproot :
    HTTPROOT = config.myslice.httproot
else :
    HTTPROOT = ROOT

# DATAROOT
if config.myslice.httproot :
    DATAROOT = config.myslice.dataroot
else :
    DATAROOT = ROOT


# dec 2013 - we currently have 2 auxiliary subdirs with various utilities
# that we do not wish to package 
# * sandbox is for plugin developers
# * sample is for various test views
# for each of these, if we find a directory of that name under ROOT, it then gets
# inserted in INSTALLED_APPS and its urls get included (see urls.py)
auxiliaries = [ 'sandbox', 'sample', ]

####################
ADMINS = (
    # ('your_name', 'your_email@test.com'),
)

MANAGERS = ADMINS

# Mail configuration
#DEFAULT_FROM_EMAIL = "root@theseus.ipv6.lip6.fr"
#EMAIL_HOST_PASSWORD = "mypassword"

if config.myslice.default_sender:
    DEFAULT_FROM_EMAIL = config.myslice.default_sender

EMAIL_HOST = "localhost"
EMAIL_PORT = 25
EMAIL_USE_TLS = False

# use the email for debugging purpose
# turn on debugging: 
# python -m smtpd -n -c DebuggingServer localhost:1025

#if DEBUG:
#    EMAIL_HOST = 'localhost'
#    EMAIL_PORT = 1025
#    EMAIL_HOST_USER = ''
#    EMAIL_HOST_PASSWORD = ''
#    EMAIL_USE_TLS = False
#    DEFAULT_FROM_EMAIL = 'testing@example.com'

if config.database.engine : 
    DATABASES = {
        'default': {
            'ENGINE'    : 'django.db.backends.%s' % config.database.engine,
            'USER'      : config.database.user or '',
            'PASSWORD'  : config.database.password or '',
            'HOST'      : config.database.host or '',
            'PORT'      : config.database.port or '',
        }
    }
    if config.database.engine == 'sqlite3' :
        DATABASES['default']['NAME'] = os.path.join(DATAROOT,'%s.sqlite3' % config.database.name)
    else :
        DATABASES['default']['NAME'] = config.database.name
else :
    # default database is sqlite
    DATABASES = {
        'default': {
            'ENGINE'    : 'django.db.backends.sqlite3',
            'NAME'      : os.path.join(DATAROOT,'myslice.sqlite3'),
            'USER'      : '',
            'PASSWORD'  : '',
            'HOST'      : '',
            'PORT'      : '',
        }
    }

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/Paris'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(HTTPROOT,'static')

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    # Thierry : we do not need to detail the contents 
    # of our 'apps' since they're mentioned in INSTALLED_APPS
)

# Needed by PluginFinder
PLUGIN_DIR = os.path.join(ROOT,'plugins')
# ThirdPartyFinder
THIRDPARTY_DIR = os.path.join(ROOT, 'third-party')

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
# Thierry : no need for this one    
#    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'unfold.collectstatic.PluginFinder',
    'unfold.collectstatic.ThirdPartyFinder',
###    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

if config.myslice.secret_key:
    # Make this unique, and don't share it with anybody.
    SECRET_KEY = config.myslice.secret_key
else:
    raise Exception, "SECRET_KEY Not defined: Please setup a secret_key value in myslice.ini"

AUTHENTICATION_BACKENDS = ('localauth.manifoldbackend.ManifoldBackend',
                           'django.contrib.auth.backends.ModelBackend')

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'myslice.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'unfold.wsgi.application'

TEMPLATE_DIRS = []
# Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
# Always use forward slashes, even on Windows.
# Don't forget to use absolute paths, not relative paths.
if theme is not None:
    TEMPLATE_DIRS.append( os.path.join(HTTPROOT,"portal/templates", theme) )
TEMPLATE_DIRS.append( os.path.join(HTTPROOT,"portal/templates") )
TEMPLATE_DIRS.append( os.path.join(HTTPROOT,"templates") )

INSTALLED_APPS = [ 
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # handling the {% insert %} and {% container %} tags
    # see details in devel/django-insert-above-1.0-4
    'insert_above',
    # our django project
    'myslice',
    # the core of the UI
    'localauth', 
    'manifoldapi',
    'unfold',
    # plugins
    'plugins',
    # views - more or less stable 
    'ui',
    # Uncomment the next line to enable the admin:
     'django.contrib.admin',
	# FORGE Plugin app
# 	'djcelery',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    'portal',
    #'debug_toolbar',
]
# with django-1.7 we leave south and use native migrations
# managing database migrations
import django
major, minor, _, _, _ = django.VERSION
if major == 1 and minor <= 6:
    INSTALLED_APPS.append('south')

# this app won't load in a build environment
if not building:
    INSTALLED_APPS.append ('rest')

for component in components.list() :
    INSTALLED_APPS.append(component)

BROKER_URL = "amqp://myslice:myslice@localhost:5672/myslice"

for aux in auxiliaries:
    if os.path.isdir(os.path.join(ROOT,aux)): 
        logger.info("Using devel auxiliary {}".format(aux))
        INSTALLED_APPS.append(aux)

ACCOUNT_ACTIVATION_DAYS = 7 # One-week activation window; you may, of course, use a different value.

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler',
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'django.utils.log.NullHandler',
        },
        'debug':{
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        }
    },
    'loggers': {
        'myslice': {
            'handlers': ['debug'],
            'propagate': True,
            'level': 'DEBUG',
        }
    }
}

### the view to redirect malformed (i.e. with a wrong CSRF) incoming requests
# without this setting django will return a 403 forbidden error, which is fine
# if you need to see the error message then use this setting
CSRF_FAILURE_VIEW = 'manifoldapi.manifoldproxy.csrf_failure'

#################### for insert_above
#IA_JS_FORMAT = "<script type='text/javascript' src='{URL}' />"
# put stuff under static/
# IA_MEDIA_PREFIX = '/code/'

####SLA#####

SLA_COLLECTOR_URL = "http://157.193.215.125:4001/sla-collector/sla"
SLA_COLLECTOR_USER = "portal"
SLA_COLLECTOR_PASSWORD = "password"


# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'


