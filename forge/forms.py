# -*- coding:utf-8 -*-

from django import forms
from models import Lab, Course
from django.db import models

class LabForm(forms.ModelForm):
	title = forms.CharField(label= "Title")
	subject = forms.FileField(label="Subject of the lab")
	class Meta:
		model = Lab

class courseForm(forms.Form):
	lab = forms.ModelChoiceField(queryset= Lab.objects.all(), empty_label="Select a Lab")
	nbEnv = forms.IntegerField(min_value=0, label="Number of environment")
	subnet = forms.CharField(initial='10.1.0.0/16')

