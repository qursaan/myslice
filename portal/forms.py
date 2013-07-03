# -*- coding: utf-8 -*-
#
# portal/forms.py: forms for the portal application
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

from django import forms
from portal.models import PendingUser
#from crispy_forms.helper import FormHelper
#from crispy_forms.layout import Submit

class RegisterUserForm(forms.ModelForm):
# DEPRECATED #    def __init__(self, *args, **kwargs):
# DEPRECATED #        self.helper = FormHelper()
# DEPRECATED #        self.helper.form_tag = False
# DEPRECATED #        #self.helper.form_id = 'id-exampleForm'
# DEPRECATED #        self.helper.form_class = 'blueForms'
# DEPRECATED #        self.helper.form_method = 'post'
# DEPRECATED #        #self.helper.form_action = 'submit_survey'
# DEPRECATED #        self.helper.add_input(Submit('submit', 'Submit'))
# DEPRECATED #        super(RegisterUserForm, self).__init__(*args, **kwargs)

    first_name = forms.CharField( widget=forms.TextInput )
    last_name  = forms.CharField( widget=forms.TextInput )
    email      = forms.CharField( widget=forms.TextInput )
    password   = forms.CharField( widget=forms.PasswordInput )
    password2  = forms.CharField( widget=forms.PasswordInput )
    keypair    = forms.CharField( widget=forms.FileInput )
    class Meta:
        model = PendingUser

class RegisterUserStep2Form(forms.ModelForm):
    class Meta:
        model = PendingUser
