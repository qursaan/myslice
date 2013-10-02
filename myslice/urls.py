from django.conf.urls import patterns, include, url
from django.conf      import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# to enable insert_above stuff
from django.template.loader import add_to_builtins
add_to_builtins('insert_above.templatetags.insert_tags')

import portal.platformsview
import portal.dashboardview
import portal.homeview

home_view=portal.homeview.HomeView.as_view()
dashboard_view=portal.dashboardview.DashboardView.as_view()
platforms_view=portal.platformsview.PlatformsView.as_view()

#### high level choices
# main entry point (set to the / URL)
# beware that if this view is broken you end up in an endless cycle...
# maybe platforms_view would be best on the longer run
the_default_view=home_view
# where to be redirected after login
the_after_login_view=dashboard_view
# where to redirect when login is required
# might need another one ?
the_login_view=home_view

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
    (r'^/?$', the_default_view),
    #
    # login / logout
    #
    (r'^login-ok/?$', the_after_login_view, {'state': 'Welcome to MySlice'} ),
    # seems to be what login_required uses to redirect ...
    (r'^accounts/login/$', the_login_view),
    (r'^login/?$', the_login_view),
    (r'^logout/?$', 'auth.views.logout_user'),
    #
    # the manifold proxy
    #
    (r'^manifold/proxy/(?P<format>\w+)/?$', 'manifold.manifoldproxy.proxy'),
    #
    # Portal
    url(r'^portal/', include('portal.urls')),
    # Portal
    url(r'^sample/', include('sample.urls')),
    # Debug
    url(r'^debug/', include('debug_platform.urls')),
    #
    # various trash views - bound to go away 
    #
    url(r'^trash/', include('trash.urls')),

)
