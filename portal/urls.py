# -*- coding: utf-8 -*-
#
# portal/urls.py: URL mappings for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr>
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

from django.conf.urls import patterns, include, url
from portal           import views
from portal.views     import UserRegisterView, UserValidateView, DashboardView, PresViewView
from portal.util      import TemplateView

# DEPRECATED #named_register_forms = (
# DEPRECATED #    ("step1", RegisterUserForm),
# DEPRECATED #    ("step2", RegisterUserStep2Form)
# DEPRECATED #)
# DEPRECATED #
# DEPRECATED #register_wizard = RegisterUserWizardView.as_view(named_register_forms,
# DEPRECATED #    url_name="register_wizard_step")

urlpatterns = patterns('',
    # User registration
    url(r'^user/register/?$', UserRegisterView.as_view(), name='user_register'),
    url(r'^user/register/complete/$',
        TemplateView.as_view(template_name='user_register_complete.html'),
        name='user_register_complete'),
    # User validation
    url(r'^user/validate/?$', UserValidateView.as_view(), name='user_validate'),
    url(r'^dashboard/?$', DashboardView.as_view(), name='dashboard'),
    #url(r'^my_account/?$', MyAccountView.as_view(), name='my_account'),
    url(r'^account/?$', views.my_account),
    url(r'^acc_process/?$', views.acc_process),
    url(r'^register/?$', views.register_4m_f4f),
    #url(r'^reg_process/?$', views.reg_4m_f4f_process),
    url(r'^contact/?$', views.contact),
    # Slice request
    url(r'^slice_request/?$', views.slice_request),

    url(r'^pres_view/?$', PresViewView.as_view(), name='pres_view'),
    (r'^methods/(?P<type>\w+)/?$', 'portal.views.pres_view_methods'),
    (r'^animation/(?P<constraints>[^/]+)/(?P<id>\w+)/?$', 'portal.views.pres_view_animation'),
    (r'^static/(?P<constraints>[^/]+)/(?P<id>\w+)/?$', 'portal.views.pres_view_static'),
    #url(r'^slice/request/?$',  views.slice_request,  name='slice_request'),
    # Slice confirmation
    #url(r'^slice/validate/?$', views.slice_validate, name='slice_validate'),
)
# (r'^accounts/', include('registration.backends.default.urls')),


# DEPRECATED #    url(r'^$', views.index, name='index'),
# DEPRECATED #    url(r"^registerwizard/(?P<step>[-\w]+)/$", register_wizard,
# DEPRECATED #        name="register_wizard_step"),
# DEPRECATED #    url(r"^registerwizard/$", register_wizard, name="register_wizard")
