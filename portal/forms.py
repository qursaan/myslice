# -*- coding: utf-8 -*-
#
# portal/forms.py: forms for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr>
#   Mohammed-Yasin Rahman <mohammed-yasin.rahman@lip6.fr>
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
from portal.models import PendingUser, PendingSlice
#from crispy_forms.helper import FormHelper
#from crispy_forms.layout import Submit
from django.utils.translation import ugettext_lazy as _

class UserRegisterForm(forms.Form): # Not ModelForm
    """
    Form for registering a new user account.
    
    Validates that the requested username is not already in use, and
    requires the password to be entered twice to catch typos.
    
    Subclasses should feel free to add any additional validation they
    need, but should avoid defining a ``save()`` method -- the actual
    saving of collected user data is delegated to the active
    registration backend.

    """
    required_css_class = 'required'
    
    first_name = forms.RegexField(regex=r'^[\w+\s.@+-]+$',
                                 max_length=30,
                                 label=_("First name"),
                                 error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    last_name = forms.RegexField(regex=r'^[\w+\s.@+-]+$',
                                 max_length=30,
                                 label=_("Last name"),
                                 error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    affiliation = forms.RegexField(regex=r'^[\w+\s.@+-]+$',
                             max_length=30,
                             label=_("Affiliation"),
                             error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})

    email = forms.EmailField(label=_("E-mail"))
    password1 = forms.CharField(widget=forms.PasswordInput,
                                label=_("Password"))
    password2 = forms.CharField(widget=forms.PasswordInput,
                                label=_("Password (again)"))
    keypair    = forms.CharField( widget=forms.FileInput )
   
    #my_keypairs = forms.ChoiceField(widget = forms.Select(), 
    #             choices = ([('1','generate'), ('2','upload')])) 
    tos = forms.BooleanField(widget=forms.CheckboxInput,
                             label=_(u'I have read and agree to the Terms of Service'),
                             error_messages={'required': _("You must agree to the terms to register")})

#    def clean_username(self):
#        """
#        Validate that the username is alphanumeric and is not already
#        in use.
#        
#        """
#        existing = User.objects.filter(username__iexact=self.cleaned_data['username'])
#        if existing.exists():
#            raise forms.ValidationError(_("A user with that username already exists."))
#        else:
#            return self.cleaned_data['username']

    def clean_email(self):
        """
        Validate that the supplied email address is unique for the
        site.
        
        """
        if PendingUser.objects.filter(email__iexact=self.cleaned_data['email']):
            raise forms.ValidationError(_("This email address is already in use. Please supply a different email address."))
        return self.cleaned_data['email']

    def clean(self):
        """
        Verifiy that the values entered into the two password fields
        match. Note that an error here will end up in
        ``non_field_errors()`` because it doesn't apply to a single
        field.
        
        """
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError(_("The two password fields didn't match."))
        return self.cleaned_data

# DEPRECATED #    class Meta:
# DEPRECATED #        model = PendingUser

class SliceRequestForm(forms.ModelForm):
    slice_name = forms.CharField( widget=forms.TextInput )
    class Meta:
        model = PendingSlice

# DEPRECATED #class RegisterUserStep2Form(forms.ModelForm):
# DEPRECATED #    class Meta:
# DEPRECATED #        model = PendingUser

class ContactForm(forms.Form):
    first_name = forms.CharField()
    last_name = forms.CharField()
    affiliation = forms.CharField()
    subject = forms.CharField(max_length=100)
    message = forms.CharField(widget=forms.Textarea)
    email = forms.EmailField()
    cc_myself = forms.BooleanField(required=False)

class SliceRequestForm(forms.Form):
    slice_name = forms.CharField()
    number_of_nodes  = forms.DecimalField()
    type_of_nodes = forms.CharField()
    purpose = forms.CharField(widget=forms.Textarea)
    email = forms.EmailField()
    cc_myself = forms.BooleanField(required=False)

    
