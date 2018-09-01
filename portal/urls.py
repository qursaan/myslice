# -*- coding: utf-8 -*-
#
# portal/urls.py: URL mappings for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr
#   Loic Baron  <loic.baron@lip6.fr>
#   Mohammed Yasin Rahman <mohammed-yasin.rahman@lip6.fr>
#   Ciro Scognamiglio   <ciro.scognamiglio@lip6.fr>
# Copyright 2013, UPMC Sorbonne Universités / LIP6
#
# This program is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 3, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
# details.
# 
# You should have received a copy of the GNU General Public License along with
# this program; see the file COPYING.  If not, write to the Free Software
# Foundation, 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

from django.views.generic.base      import TemplateView
from django.conf.urls               import patterns, include, url

<<<<<<< HEAD
from portal.usersview           import UsersView
from portal.manageuserview      import UserView, user_process    
from portal.platformsview       import PlatformsView
from portal.platformview        import PlatformView
from portal.resourceview        import ResourceView
from portal.dashboardview       import DashboardView
from portal.accountview         import AccountView, account_process
from portal.contactview         import ContactView
from portal.slicerequestview    import SliceRequestView
from portal.registrationview    import RegistrationView
from portal.joinview            import JoinView
from portal.sliceview           import SliceView
from portal.validationview      import ValidatePendingView
from portal.experimentview      import ExperimentView
from portal.documentationview   import DocumentationView
from portal.supportview         import SupportView
=======
from portal.about                   import AboutView
from portal.institution             import InstitutionView
from portal.usersview               import UsersView
from portal.manageuserview          import UserView, user_process    
from portal.platformsview           import PlatformsView
from portal.platformview            import PlatformView
from portal.resourceview            import ResourceView
from portal.dashboardview           import DashboardView
from portal.accountview             import AccountView, account_process
from portal.contactview             import ContactView
from portal.slicerequestview        import SliceRequestView
from portal.projectrequestview      import ProjectRequestView
from portal.registrationview        import RegistrationView
from portal.joinview                import JoinView
from portal.sliceviewold            import SliceView
from portal.validationview          import ValidatePendingView
#from portal.experimentview         import ExperimentView
from portal.termsview               import TermsView
from portal.univbrisview            import UnivbrisView
from portal.univbrisvtam            import UnivbrisVtam
>>>>>>> onelab

from portal.manualdelegationview    import ManualDelegationView
from portal.releasenotesview       import ReleaseNotesView

from portal.servicedirectory        import ServiceDirectoryView

from portal.documentationview       import DocumentationView
from portal.supportview             import SupportView
from portal.emailactivationview     import ActivateEmailView
# hopefully these should move in dedicated source files too
from portal.views                   import PresViewView, pres_view_static, pres_view_methods, pres_view_animation
from portal.django_passresetview    import password_reset, password_reset_done, password_reset_confirm, password_reset_complete 

from portal.reputationview      import ReputationView

# DEPRECATED #named_register_forms = (
# DEPRECATED #    ("step1", RegisterUserForm),
# DEPRECATED #    ("step2", RegisterUserStep2Form)
# DEPRECATED #)
# DEPRECATED #
# DEPRECATED #register_wizard = RegisterUserWizardView.as_view(named_register_forms,
# DEPRECATED #    url_name="register_wizard_step")

urlpatterns = patterns('',
    # User registration
    #url(r'^user/register/?$', UserRegisterView.as_view(), name='user_register'),
    url(r'^user/register/complete/$',
        TemplateView.as_view(template_name='user_register_complete.html'),
        name='user_register_complete'),
    # User validation
    #url(r'^user/validate/?$', UserValidateView.as_view(), name='user_validate'),
    url(r'^dashboard/?$', DashboardView.as_view(), name='dashboard'),
    #url(r'^my_account/?$', MyAccountView.as_view(), name='my_account'),
    url(r'^account/?$', AccountView.as_view(), name='account'),
    url(r'^institution/?$', InstitutionView.as_view(), name='institution'),
    url(r'^project/(?P<authority_hrn>[\w\.]+)/?$', InstitutionView.as_view(), name='project'),
    url(r'^about/?$', AboutView.as_view(), name='about'),
    url(r'^users/?$', UsersView.as_view(), name='user_list'),
    url(r'^user/(?P<email>[\w\s.@\-]+)/?$', UserView.as_view(), name='user'),
    url(r'^user/(?P<email>[\w\s.@\-]+)/user_process/?$', user_process),
    url(r'^platforms/?$', PlatformsView.as_view(), name='platforms'),
    url(r'^platform/(?P<platformname>[\w\.\-]+)/?$', PlatformView.as_view(), name='platform'),
    url(r'^resource/(?P<urn>[\w\.\-\+\:]+)/?$', ResourceView.as_view(), name='resource'),
    url(r'^slice/?$',SliceView.as_view(),name='slice'),
    url(r'^slice/(?P<slicename>[\w\.]+)/?$', SliceView.as_view(),name='slice'),
    url(r'^account/account_process/?$', account_process),
    url(r'^register/?$', RegistrationView.as_view(), name='registration'),
    url(r'^join/?$', JoinView.as_view(), name='join'),
    url(r'^contact/?$', ContactView.as_view(), name='contact'),
<<<<<<< HEAD
    url(r'^experiment?$', ExperimentView.as_view(), name='experiment'),
=======
    #url(r'^experiment?$', ExperimentView.as_view(), name='experiment'),
>>>>>>> onelab
    url(r'^support/?$', SupportView.as_view(), name='support'),
    url(r'^support/documentation?$', DocumentationView.as_view(), name='FAQ'),
    #url(r'^pass_reset/?$', PassResetView.as_view(), name='pass_rest'),
    # Slice request
    url(r'^slice_request/?$', SliceRequestView.as_view(), name='slice_request'),
    # Project request
    url(r'^project_request/?$', ProjectRequestView.as_view(), name='project_request'),
    url(r'^terms/?$', TermsView.as_view(), name='terms'),
    url(r'^manual_delegation/?$', ManualDelegationView.as_view(), name='manual_delegation'),
    url(r'^release_notes/?$', ReleaseNotesView.as_view(), name='release_notes'),
    # Validate pending requests
    url(r'^validate/?$', ValidatePendingView.as_view()),
    # http://stackoverflow.com/questions/2360179/django-urls-how-to-pass-a-list-of-items-via-clean-urls
    # (r'^validate_action/(?P<constraints>[^/]+)/(?P<id>\w+)/?$', 'portal.views.pres_view_static'),
    url(r'^validate_action(?P<id>(?:/\w+)+)/?$', 'portal.actions.validate_action'),
    url(r'^reject_action(?P<id>(?:/\w+)+)/?$', 'portal.actions.reject_action'),
    url(r'^pres_view/?$', PresViewView.as_view(), name='pres_view'),
    (r'^methods/(?P<type>\w+)/?$', 'portal.views.pres_view_methods'),
    (r'^animation/(?P<constraints>[^/]+)/(?P<id>\w+)/?$', 'portal.views.pres_view_animation'),
    (r'^static/(?P<constraints>[^/]+)/(?P<id>\w+)/?$', 'portal.views.pres_view_static'),
    #url(r'^slice/request/?$',  views.slice_request,  name='slice_request'),
    # Slice confirmation
    #url(r'^slice/validate/?$', views.slice_validate, name='slice_validate'),
    url(r'^email_activation/(?P<hash_code>[\w\W\-]+)/?$', ActivateEmailView.as_view(), name='email_activate'), 
    url(r'^pass_reset/$', 
        'portal.django_passresetview.password_reset', 
        {'post_reset_redirect' : '/portal/password/reset/done/'}),
    (r'^password/reset/done/$',
        'portal.django_passresetview.password_reset_done'),
    (r'^password/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 
        'portal.django_passresetview.password_reset_confirm', 
        {'post_reset_redirect' : '/portal/password/done/'}),
    (r'^password/done/$', 
        'portal.django_passresetview.password_reset_complete'),

    url(r'^univbris/?$', UnivbrisView.as_view(), name='univbris'),
    url(r'^univbrisvtam/?$', UnivbrisVtam.as_view(), name='univbrisvtam'),   

    url(r'^servicedirectory/?$', ServiceDirectoryView.as_view(), name='servicedirectory'),


    url(r'^reputation/?$', ReputationView.as_view(), name='reputation'),
    url(r'^reputation/submit_eval/?$', ReputationView.as_view(), name='reputation_submit_eval'),
    
    
)
# (r'^accounts/', include('registration.backends.default.urls')),


# DEPRECATED #    url(r'^$', views.index, name='index'),
# DEPRECATED #    url(r"^registerwizard/(?P<step>[-\w]+)/$", register_wizard,
# DEPRECATED #        name="register_wizard_step"),
# DEPRECATED #    url(r"^registerwizard/$", regster_wizard, name="register_wizard")
