from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                (r'^influxdb/create/(?P<slicename>[^/]+)/?$', 'influxdb.client.createDatabase'),
                (r'^influxdb/info/(?P<slicename>[^/]+)/?$', 'influxdb.client.infoDatabase'),
)