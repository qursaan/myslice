#!/usr/bin/env python 
# -*- coding: utf-8 -*-
#
# DJANGO_SETTINGS_MODULE="myslice.settings" ./test-send-email.py
#
from django.core import mail
from django.test import TestCase

class EmailTest(TestCase):
    def test_send_email(self):
        mail.send_mail('Subject here', 'Here is the message.',
            'support@myslice.info', ['jordan.auge@lip6.fr', 'jordan.auge@free.fr'],
            fail_silently=False)
        print mail.outbox
        self.assertEquals(len(mail.outbox), 1)
        self.assertEquals(mail.outbox[0].subject, 'Subject here')
