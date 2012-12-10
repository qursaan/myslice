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
    (r'^/?$', 'slice.views.fake_slice_view'),
    # seems to be what login_required uses to redirect ...
    (r'^accounts/login/$', 'auth.views.login_user'),
    (r'^login/?$', 'auth.views.login_user'),
    (r'^logout/?$', 'auth.views.logout_user'),
    (r'^logout/confirm/?$', 'auth.views.do_logout_user'),
    (r'^slice/?$', 'slice.views.fake_slice_view'),
    (r'^slice/(?P<name>[\w\.]+)/?$', 'slice.views.fake_slice_view'),
    (r'^tab/?$', 'slice.views.tab_view'),
    (r'^scroll/?$', 'slice.views.scroll_view'),
    (r'^plugin/?$', 'engine.views.test_plugin_view'),
)
