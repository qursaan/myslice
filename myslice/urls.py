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
import portal.newsview
import portal.loginwidget

from portal.about                   import AboutView
from portal.registrationview        import RegistrationView
from portal.accountview             import AccountView, account_process
from portal.institution             import InstitutionView

from portal.supportview             import SupportView
from portal.contactview             import ContactView

from portal.termsview               import TermsView

home_view=portal.homeview.HomeView.as_view()
dashboard_view=portal.dashboardview.DashboardView.as_view()
platforms_view=portal.platformsview.PlatformsView.as_view()

#import portal.testbedlist
import portal.sliceview
import portal.sliceresourceview

import portal.slicetabexperiment
import portal.slicetabinfo
import portal.slicetabtestbeds
import portal.slicetabusers
import portal.slicetabmeasurements 

import portal.managementtababout
import portal.managementtabrequests

import forge.views

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
    (r'^sfa/(?P<method>[^/]+)/?$', 'rest.sfa_api.dispatch'),
    (r'^table/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^datatable/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.get.dispatch'),
    (r'^update/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.update.dispatch'),
    (r'^create/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.create.dispatch'),
    (r'^delete/(?P<object_type>[^/]+)/(?P<object_name>[^/]+)?/?$', 'rest.delete.dispatch'),
    (r'^credentials/(?P<action>[^/]+)/?$', 'rest.credentials.dispatch'),
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
    
    (r'^slice/(?P<slicename>[^/]+)/?$', portal.sliceview.SliceView.as_view()),
    (r'^info/(?P<slicename>[^/]+)/?$', portal.slicetabinfo.SliceInfoView.as_view()),
    (r'^testbeds/(?P<slicename>[^/]+)/?$', portal.slicetabtestbeds.SliceTabTestbeds.as_view()),
    (r'^measurements/(?P<slicename>[^/]+)/?$', portal.slicetabmeasurements.SliceTabMeasurements.as_view()),
    (r'^experiment/(?P<slicename>[^/]+)/?$', portal.slicetabexperiment.ExperimentView.as_view()),
    (r'^studentslabs/(?P<slicename>[^/]+)/?$', forge.views.CreateCourseViev.as_view()),
    
    url(r'^about/?$', AboutView.as_view(), name='about'),
    
    url(r'^institution/?$', InstitutionView.as_view(), name='institution'),
    (r'^management/requests/?$', portal.managementtabrequests.ManagementRequestsView.as_view()),
    (r'^management/about/?$', portal.managementtababout.ManagementAboutView.as_view()),
    #
    url(r'^register/?$', RegistrationView.as_view(), name='registration'),
    url(r'^account/?$', AccountView.as_view(), name='account'),
    url(r'^account/account_process/?$', account_process),
    url(r'^contact/?$', ContactView.as_view(), name='contact'),
    url(r'^terms/?$', TermsView.as_view(), name='terms'),
    url(r'^support/?$', SupportView.as_view(), name='support'),
    #
    url(r'^portal/', include('portal.urls')),

    # SLA
    url(r'^sla/', include('sla.urls')),
]

#this one would not match the convention
# url(r'^debug/', include('debug_platform.urls')),
# but it was commented out anyways
for aux in auxiliaries:
    if aux in INSTALLED_APPS:
        urls.append ( url ( r'^%s/'%aux, include ('%s.urls'%aux )))

urlpatterns = patterns(*urls)
