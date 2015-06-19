import os
import sys

path = '/var/myslice-f4f'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'myslice.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

