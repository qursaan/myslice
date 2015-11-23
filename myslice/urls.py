from django.conf.urls import patterns, include, url
from django.conf      import settings
from django.contrib import admin

##
# components module
##
import components

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# to enable insert_above stuff
# add_to_builtins has changed location with django-1.7
# also note this will probably go away some day
try:
    from django.template.loader import add_to_builtins
except:
    from django.template.base import add_to_builtins
add_to_builtins('insert_above.templatetags.insert_tags')

from settings import auxiliaries, INSTALLED_APPS

import portal.about
import portal.institution
import portal.registrationview
import portal.accountview
import portal.contactview
import portal.termsview
import portal.supportview

import portal.platformsview
import portal.dashboardview
import portal.homeview
import portal.newsview
import portal.loginwidget

platforms_view=portal.platformsview.PlatformsView.as_view()

#import portal.testbedlist
import portal.sliceview
import portal.sliceresourceview

# Testing sfa rest
import portal.resources

import portal.slicetabexperiment
import portal.slicetabcloud
import portal.slicetabinfo
import portal.slicetabtestbeds
import portal.slicetabusers
import portal.slicetabmeasurements 

import portal.managementtababout
import portal.managementtabrequests

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
    (r'^/?$', portal.homeview.HomeView.as_view()),
    #
    # login / logout
    (r'^login-ok/?$', portal.dashboardview.DashboardView.as_view(), {'state': 'Welcome to MySlice'} ),
    #
    # seems to be what login_required uses to redirect ...
    (r'^accounts/login/$', portal.homeview.HomeView.as_view()),
    (r'^login/?$', portal.homeview.HomeView.as_view()),
    (r'^logout/?$', 'localauth.views.logout_user'),
    #
    # the manifold proxy
    (r'^manifold/proxy/(?P<format>\w+)/?$', 'manifoldapi.manifoldproxy.proxy'),
    #
    #
    # RESTful interface
    (r'^rest/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^sfa/(?P<method>[^/]+)/?$', 'rest.sfa_api.dispatch'),
    (r'^table/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^datatable/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^update/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.update.dispatch'),
    (r'^create/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.create.dispatch'),
    (r'^delete/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.delete.dispatch'),
    (r'^local_user/(?P<action>[^/]+)/?$', 'rest.local_user.dispatch'),
    (r'^credentials/(?P<action>[^/]+)/?$', 'rest.credentials.dispatch'),
    (r'^cache/(?P<action>[^/]+)/?$', 'rest.cache.dispatch'),
    (r'^initscript/(?P<action>[^/]+)/?$', 'rest.initscript.dispatch'),
    (r'^authority/(?P<action>[^/]+)/?$', 'rest.authority.dispatch'),
    (r'^portal_version/?$', 'rest.portal_version.dispatch'),
    #
    # REST monitoring
    (r'^monitor/services/?$', 'rest.monitor.servicesStatus'),
    #
    #(r'^view/?', include('view.urls')),
    #(r'^list/slices', 'view.list.slices')
    #
    # Login widget to be used in an iframe
    (r'^loginwidget/?$', portal.loginwidget.LoginWidget.as_view()),
    #
    # Portal
    (r'^news/?$', portal.newsview.NewsView.as_view()),
    (r'^resources/(?P<slicename>[^/]+)/?$', portal.sliceresourceview.SliceResourceView.as_view()),
    (r'^users/(?P<slicename>[^/]+)/?$', portal.slicetabusers.SliceUserView.as_view()),

    # Testing sfa rest
    (r'^sfa_resources/(?P<slicename>[^/]+)/?$', portal.resources.ResourcesView.as_view()),
    
    (r'^slice/(?P<slicename>[^/]+)/?$', portal.sliceview.SliceView.as_view()),
    (r'^info/(?P<slicename>[^/]+)/?$', portal.slicetabinfo.SliceInfoView.as_view()),
    (r'^testbeds/(?P<slicename>[^/]+)/?$', portal.slicetabtestbeds.SliceTabTestbeds.as_view()),
    (r'^measurements/(?P<slicename>[^/]+)/?$', portal.slicetabmeasurements.SliceTabMeasurements.as_view()),
    (r'^experiment/(?P<slicename>[^/]+)/?$', portal.slicetabexperiment.ExperimentView.as_view()),
    (r'^cloud/(?P<slicename>[^/]+)/?$', portal.slicetabcloud.CloudView.as_view()),
    
    
    url(r'^about/?$', portal.about.AboutView.as_view(), name='about'),
    
    url(r'^institution/?$', portal.institution.InstitutionView.as_view(), name='institution'),
    (r'^management/requests/?$', portal.managementtabrequests.ManagementRequestsView.as_view()),
    (r'^management/about/?$', portal.managementtababout.ManagementAboutView.as_view()),
    #
    url(r'^register/?$', portal.registrationview.RegistrationView.as_view(), name='registration'),
    url(r'^account/?$', portal.accountview.AccountView.as_view(), name='account'),
    url(r'^account/account_process/?$', portal.accountview.account_process),
    url(r'^contact/?$', portal.contactview.ContactView.as_view(), name='contact'),
    url(r'^terms/?$', portal.termsview.TermsView.as_view(), name='terms'),
    url(r'^support/?$', portal.supportview.SupportView.as_view(), name='support'),
    #
    url(r'^portal/', include('portal.urls')),

    # SLA
    #url(r'^sla/', include('sla.urls')),
]

urls.extend( components.urls() )

#this one would not match the convention
# url(r'^debug/', include('debug_platform.urls')),
# but it was commented out anyways
for aux in auxiliaries:
    if aux in INSTALLED_APPS:
        urls.append ( url ( r'^%s/'%aux, include ('%s.urls' % aux )))

urlpatterns = patterns(*urls)
