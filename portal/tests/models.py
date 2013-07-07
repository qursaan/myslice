#!/usr/bin/env python 
# -*- coding: utf-8 -*-
#
#DJANGO_SETTINGS_MODULE="repos.myslice-django.myslice.settings" ./test-send-email.py
#
#from django.core import mail
from django.test import TestCase
from django.conf import settings
from django.core.mail import EmailMessage
import myslice.settings

class EmailTest(TestCase):
    def test_send_email(self):
	email = EmailMessage('Hello', 'World', to=['jordan.auge@lip6.fr'])
        email.send()





