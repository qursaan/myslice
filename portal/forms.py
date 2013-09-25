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
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}))
    affiliation = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}))
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'form-control'}))
    subject = forms.CharField(max_length=100,widget=forms.TextInput(attrs={'class':'form-control'}))
    message = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control'}))
    cc_myself = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs={'class':'form-control'}))

class SliceRequestForm(forms.Form):
    slice_name = forms.CharField()
    authority_hrn = forms.ChoiceField(choices=[(1, 'un')])
    number_of_nodes  = forms.DecimalField()
    type_of_nodes = forms.CharField()
    purpose = forms.CharField(widget=forms.Textarea)
    email = forms.EmailField()
    cc_myself = forms.BooleanField(required=False)

    def __init__(self, *args, **kwargs):
        initial =  kwargs.get('initial', {})
        authority_hrn = initial.get('authority_hrn', None)

        # set just the initial value
        # in the real form needs something like this {'authority_hrn':'a'}
        # but in this case you want {'authority_hrn':('a', 'letter_a')}
        if authority_hrn:
            kwargs['initial']['authority_hrn'] = authority_hrn[0]

        # create the form
        super(SliceRequestForm, self).__init__(*args, **kwargs)

        # self.fields only exist after, so a double validation is needed
        if authority_hrn:# and authority_hrn[0] not in (c[0] for c in authority_hrn):
            # XXX This does not work, the choicefield is not updated...
            #self.fields['authority_hrn'].choices.extend(authority_hrn)
            self.fields['authority_hrn'] = forms.ChoiceField( choices=authority_hrn)
    
