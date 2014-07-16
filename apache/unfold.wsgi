import os
import sys

#site.addsitedir('/var/www/myslice')

path = '/var/www/myslice'
if path not in sys.path:
    sys.path = [path] + sys.path
print sys.path

os.environ['DJANGO_SETTINGS_MODULE'] = 'myslice.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
