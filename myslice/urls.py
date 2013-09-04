from django.conf.urls import patterns, include, url
from django.conf      import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# to enable insert_above stuff
from django.template.loader import add_to_builtins
add_to_builtins('insert_above.templatetags.insert_tags')

import portal.sliceview
import portal.platformsview
import portal.dashboardview

# main entry point (set to the / URL)
## beware before adopting this one
# if anything goes wrong in this page you end up in an endless cycle
#default_view=portal.platformsview.PlatformsView.as_view()
default_view='auth.views.login_user'
# where to be redirected after login
after_login_view=portal.dashboardview.DashboardView.as_view()

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
    # the slice view
    #
    (r'^slice/?$',                        portal.sliceview.SliceView.as_view()),
    (r'^slice/(?P<slicename>[\w\.]+)/?$', portal.sliceview.SliceView.as_view()),
    #
    # various trash views
    #
    (r'^tab/?$',                          'trash.sampleviews.tab_view'),
    (r'^scroll/?$',                       'trash.sampleviews.scroll_view'),
    (r'^plugin/?$',                       'trash.pluginview.test_plugin_view'),
    (r'^dashboard/?$',                    'trash.dashboard.dashboard_view'),
    # Portal
    url(r'^portal/', include('portal.urls')),
    # Portal
    url(r'^sample/', include('sample.urls')),
    # Debug
    url(r'^debug/', include('debug_platform.urls')),
    # Static files
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),


)
