from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# to enable insert_above stuff
from django.template.loader import add_to_builtins
add_to_builtins('insert_above.templatetags.insert_tags')

urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'myslice.views.home', name='home'),
    # url(r'^myslice/', include('myslice.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    (r'^login/$', 'auth.views.login_user'),
    (r'^slice/$', 'slice.views.foo'),
)
