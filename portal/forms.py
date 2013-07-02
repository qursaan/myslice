#-*- coding: utf-8 -*-

from django import forms
from portal.models import PendingUser
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit

class RegisterUserForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_tag = False
        #self.helper.form_id = 'id-exampleForm'
        self.helper.form_class = 'blueForms'
        self.helper.form_method = 'post'
        #self.helper.form_action = 'submit_survey'
        self.helper.add_input(Submit('submit', 'Submit'))
        super(RegisterUserForm, self).__init__(*args, **kwargs)

    first_name = forms.CharField( widget=forms.TextInput )
    last_name  = forms.CharField( widget=forms.TextInput )
    email      = forms.CharField( widget=forms.TextInput )
    password   = forms.CharField( widget=forms.PasswordInput )
    password2  = forms.CharField( widget=forms.PasswordInput )
    keypair    = forms.CharField( widget=forms.PasswordInput )
    #keypair    = forms.CharField( widget=forms.FileInput )
    class Meta:
        model = PendingUser

class RegisterUserStep2Form(forms.ModelForm):
    class Meta:
        model = PendingUser
