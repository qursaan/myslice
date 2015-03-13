from django.conf.urls import patterns, url, include

import forge.views

urlpatterns = patterns('',
                (r'^studentslabs/(?P<slicename>[^/]+)/?$', forge.views.CreateCourseViev.as_view())
)