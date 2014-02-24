
from django.conf.urls           import patterns, include, url
from django.conf      import settings


urlpatterns = patterns('',
    url(r'^rest/get/slice/(?P<slice_name>[^/]+)/?$', 'rest.get.slice')
)
