from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# to enable insert_above stuff
from django.template.loader import add_to_builtins
add_to_builtins('insert_above.templatetags.insert_tags')

# main entry point (set to the / URL)
default_view='trash.pluginview.test_plugin_view'
# where to be redirected after login
after_login_view='trash.dashboard.dashboard_view'

urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'myslice.views.home', name='home'),
    # url(r'^myslice/', include('myslice.foo.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    #
    # default / view
    #
    (r'^/?$', default_view),
    #
    # login / logout
    #
    (r'^login-ok/?$', after_login_view),
    # seems to be what login_required uses to redirect ...
    (r'^accounts/login/$', 'auth.views.login_user'),
    (r'^login/?$', 'auth.views.login_user'),
    (r'^logout/?$', 'auth.views.logout_user'),
    #
    # the manifold proxy
    #
    (r'^manifold/proxy/(?P<format>\w+)/?$', 'manifold.manifoldproxy.proxy'),
    #
    # various trash views
    #
    (r'^tab/?$', 'trash.sampleviews.tab_view'),
    (r'^scroll/?$', 'trash.sampleviews.scroll_view'),
    (r'^plugin/?$', 'trash.pluginview.test_plugin_view'),
    (r'^dashboard/?$', 'trash.dashboard.dashboard_view'),
    (r'^slice/?$', 'trash.sliceview.slice_view'),
    (r'^slice/(?P<slicename>[\w\.]+)/?$', 'trash.sliceview.slice_view'),
)
