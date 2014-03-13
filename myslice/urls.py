from django.conf.urls import patterns, include, url
from django.conf      import settings
from django.contrib import admin

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# to enable insert_above stuff
from django.template.loader import add_to_builtins
add_to_builtins('insert_above.templatetags.insert_tags')

from settings import auxiliaries, INSTALLED_APPS

import portal.platformsview
import portal.dashboardview
import portal.homeview

home_view=portal.homeview.HomeView.as_view()
dashboard_view=portal.dashboardview.DashboardView.as_view()
platforms_view=portal.platformsview.PlatformsView.as_view()

import portal.testbedlist
import portal.sliceview
import portal.sliceresourceview

import portal.slicetabexperiment
import portal.slicetabinfo
import portal.slicetabtestbeds

from portal.sliceuserview import SliceUserView 

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
admin.autodiscover()
urls = [
    '',
    # Examples:
    # url(r'^$', 'myslice.views.home', name='home'),
    # url(r'^myslice/', include('myslice.foo.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),
    #
    # default / view
    (r'^/?$', the_default_view),
    #
    # login / logout
    (r'^login-ok/?$', the_after_login_view, {'state': 'Welcome to MySlice'} ),
    #
    # seems to be what login_required uses to redirect ...
    (r'^accounts/login/$', the_login_view),
    (r'^login/?$', the_login_view),
    (r'^logout/?$', 'auth.views.logout_user'),
    #
    # the manifold proxy
    (r'^manifold/proxy/(?P<format>\w+)/?$', 'manifoldapi.manifoldproxy.proxy'),
    #
    #
    # RESTful interface
    (r'^rest/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^table/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^datatable/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^update/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.update.dispatch'),
    (r'^create/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.create.dispatch'),
    (r'^delete/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.delete.dispatch'),
    #
    #
    #(r'^view/?', include('view.urls')),
    #(r'^list/slices', 'view.list.slices')
    #
    #
    # Portal
    
    (r'^resources/(?P<slicename>[^/]+)/?$', portal.sliceresourceview.SliceResourceView.as_view()),
    
    (r'^slice/(?P<slicename>[^/]+)/?$', portal.sliceview.SliceView.as_view()),
    
    (r'^info/(?P<slicename>[^/]+)/?$', portal.slicetabinfo.SliceInfoView.as_view()),
    (r'^testbeds/(?P<slicename>[^/]+)/?$', portal.slicetabtestbeds.SliceTabTestbeds.as_view()),
    (r'^users/(?P<slicename>[^/]+)/?$', SliceUserView.as_view()),
    (r'^experiment/(?P<slicename>[^/]+)/?$', portal.slicetabexperiment.ExperimentView.as_view()),
    url(r'^portal/', include('portal.urls')),
]

#this one would not match the convention
# url(r'^debug/', include('debug_platform.urls')),
# but it was commented out anyways
for aux in auxiliaries:
    if aux in INSTALLED_APPS:
        urls.append ( url ( r'^%s/'%aux, include ('%s.urls'%aux )))

urlpatterns = patterns(*urls)

# Shibboleth - Edelberto
urlpatterns += patterns('',
   #url(r'^cafe/', 'plugins.cafe.edelberto.EdelbertoView.as_view()'),
   url(r'^cafe/', 'plugins.cafe.edelberto.index'),
)

