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
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import authenticate, get_user_model
from django.contrib.sites.models import get_current_site
from django.utils.http import int_to_base36
from django.template import loader

# TODO: Remove these automated forms and use html templates and views like any other page !
from django.contrib.auth.hashers import identify_hasher
# adapted from https://sourcegraph.com/github.com/fusionbox/django-authtools/symbols/python/authtools/forms

def is_password_unusable(pw):
    # like Django's is_password_usable, but only checks for unusable
    # passwords, not invalidly encoded passwords too.
    try:
        # 1.5
        from django.contrib.auth.hashers import UNUSABLE_PASSWORD
        return pw == UNUSABLE_PASSWORD
    except ImportError:
        # 1.6
        from django.contrib.auth.hashers import UNUSABLE_PASSWORD_PREFIX
        return pw.startswith(UNUSABLE_PASSWORD_PREFIX)




# xxx painful, but... 
# bootstrap3 requires the <input> fields to be tagged class='form-control'
# my first idea was to add this in the view template of course, BUT
# I can't find a way to access the 'type=' value for a given field
# I've looked rather deeply out there but to no avail so far
# so as we have a demo coming up soon, and until we can come with a less intrusive way to handle this...
# 
# initial version was
#class ContactForm(forms.Form):
#    first_name = forms.CharField()
#    last_name = forms.CharField()
#    affiliation = forms.CharField()
#    subject = forms.CharField(max_length=100)
#    message = forms.CharField(widget=forms.Textarea)
#    email = forms.EmailField()
#    cc_myself = forms.BooleanField(required=False)

class ContactForm(forms.Form):
   # first_name = forms.RegexField(widget=forms.TextInput(attrs={'class':'form-control'}),
   #                             regex=r'^[\w.@+-]+$',
   #                              max_length=30,
   #                              label=_("First name"),
   #                              error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
   # last_name = forms.RegexField(widget=forms.TextInput(attrs={'class':'form-control'}),
   #                             regex=r'^[\w.@+-]+$',
   #                              max_length=30,
   #                              label=_("Last name"),
   #                              error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
   # authority = forms.RegexField(widget=forms.TextInput(attrs={'class':'form-control'}),
   #                             regex=r'^[\w.@+-]+$',
   #                              max_length=30,
   #                              label=_("authority"),
   #                              error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'form-control'}))
    subject = forms.RegexField(widget=forms.TextInput(attrs={'class':'form-control'}),
                                regex=r'^[\w+\s\w+]+$',
                                 max_length=100,
                                 label=_("subject"),
                                 error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    description = forms.RegexField(widget=forms.Textarea(attrs={'class':'form-control'}),
                                regex=r'^[\w+\s\w+]+$',
                                 label=_("description"),
                                 error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})    
    cc_myself = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs={'class':'form-control'}))

class PassResetForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'form-control'}))

#class SliceRequestForm(forms.Form):
#    slice_name = forms.CharField()
#    authority_hrn = forms.ChoiceField(choices=[(1, 'un')])
#    number_of_nodes  = forms.DecimalField()
#    type_of_nodes = forms.CharField()
#    purpose = forms.CharField(widget=forms.Textarea)
#    email = forms.EmailField()
#    cc_myself = forms.BooleanField(required=False)
#
#    slice_name = forms.CharField(
#        widget=forms.TextInput(attrs={'class':'form-control'}), 
#        help_text="The name for the slice you wish to create")
#    authority_hrn = forms.ChoiceField(
#        widget    = forms.Select(attrs={'class':'form-control'}),
#        choices   = [],
#        help_text = "An authority responsible for vetting your slice")
#    number_of_nodes = forms.DecimalField(
#        widget    = forms.TextInput(attrs={'class':'form-control'}),
#        help_text = "The number of nodes you expect to request (informative)")
#    type_of_nodes = forms.CharField(
#        widget    = forms.TextInput(attrs={'class':'form-control'}),
#        help_text = "The type of nodes you expect to request (informative)")
#    purpose = forms.CharField(
#        widget    = forms.Textarea(attrs={'class':'form-control'}),
#        help_text = "The purpose of your experiment (informative)")
#    email = forms.EmailField(
#        widget    = forms.TextInput(attrs={'class':'form-control'}),
#        help_text = "Your email address")
#    cc_myself = forms.BooleanField(
#        widget    = forms.CheckboxInput(attrs={'class':'form-control'}),
#        required  = False,
#        help_text = "If you'd like to be cc'ed on the request email")
#
#    def __init__(self, *args, **kwargs):
#        initial =  kwargs.get('initial', {})
#        authority_hrn = initial.get('authority_hrn', None)
#
#        # set just the initial value
#        # in the real form needs something like this {'authority_hrn':'a'}
#        # but in this case you want {'authority_hrn':('a', 'letter_a')}
#        if authority_hrn:
#            kwargs['initial']['authority_hrn'] = authority_hrn[0]
#
#        # create the form
#        super(SliceRequestForm, self).__init__(*args, **kwargs)
#
#        # self.fields only exist after, so a double validation is needed
#        if authority_hrn:# and authority_hrn[0] not in (c[0] for c in authority_hrn):
#            # XXX This does not work, the choicefield is not updated...
#            #self.fields['authority_hrn'].choices.extend(authority_hrn)
#            self.fields['authority_hrn'] = forms.ChoiceField(
#                widget    = forms.Select(attrs={'class':'form-control'}),
#                choices   = authority_hrn,
#                help_text = "An authority responsible for vetting your slice")


class PasswordResetForm(forms.Form):
    error_messages = {
        'unknown': _("That email address doesn't have an associated "
                     "user account. Are you sure you've registered?"),
        'unusable': _("The user account associated with this email "
                      "address cannot reset the password."),
    }
    email = forms.EmailField(label=_("Email"), max_length=254)

    def clean_email(self):
        """
        Validates that an active user exists with the given email address.
        """
        UserModel = get_user_model()
        email = self.cleaned_data["email"]
        self.users_cache = UserModel._default_manager.filter(email__iexact=email)
        if not len(self.users_cache):
            raise forms.ValidationError(self.error_messages['unknown'])
        if not any(user.is_active for user in self.users_cache):
            # none of the filtered users are active
            raise forms.ValidationError(self.error_messages['unknown'])
        if any(is_password_unusable(user.password) for user in self.users_cache):
            raise forms.ValidationError(self.error_messages['unusable'])
        return email

    def save(self, domain_override=None,
             subject_template_name='registration/password_reset_subject.txt',
             email_template_name='registration/password_reset_email.html',
             use_https=False, token_generator=default_token_generator,
             from_email=None, request=None):
        """
        Generates a one-use only link for resetting password and sends to the
        user.
        """
        from django.core.mail import send_mail,EmailMultiAlternatives
        try:        
            for user in self.users_cache:
                if not domain_override:
                    current_site = get_current_site(request)
                    site_name = current_site.name
                    domain = current_site.domain
                else:
                    site_name = domain = domain_override
                c = {
                    'email': user.email,
                    'domain': domain,
                    'site_name': site_name,
                    'uid': int_to_base36(user.pk),
                    'user': user,
                    'token': token_generator.make_token(user),
                    'protocol': use_https and 'https' or 'http',
                }
                subject = loader.render_to_string(subject_template_name, c)
                # Email subject *must not* contain newlines
                subject = ''.join(subject.splitlines())
                email = loader.render_to_string(email_template_name, c)
                send_mail(subject, email, from_email, [user.email])
        except Exception, e:
            print "Failed to send email, please check the mail templates and the SMTP configuration of your server"


class SetPasswordForm(forms.Form):
    """
    A form that lets a user change set his/her password without entering the
    old password
    """
    error_messages = {
        'password_mismatch': _("The two password fields didn't match."),
    }
    new_password1 = forms.CharField(label=_("New password"),
                                    widget=forms.PasswordInput)
    new_password2 = forms.CharField(label=_("New password confirmation"),
                                    widget=forms.PasswordInput)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super(SetPasswordForm, self).__init__(*args, **kwargs)

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'])
        return password2

    def save(self, commit=True):
        self.user.set_password(self.cleaned_data['new_password1'])
        if commit:
            self.user.save()
        return self.user
    
