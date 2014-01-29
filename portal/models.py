# -*- coding: utf-8 -*-
#
# portal/models.py: models for the portal application
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

import datetime
import hashlib
import random
import re

from django.conf              import settings
from django.core.mail         import send_mail
from django.db                import models
from django.db                import transaction
from django.utils.translation import ugettext_lazy as _
from django.template.loader   import render_to_string

#from django.core.validators import validate_email

try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
except ImportError:
    from django.contrib.auth.models import User

try:
    from django.utils.timezone import now as datetime_now
except ImportError:
    datetime_now = datetime.datetime.now

SHA1_RE = re.compile('^[a-f0-9]{40}$')

# Create your models here.

class Institution(models.Model):
    name = models.TextField()
    # list of associated email domains 

class PendingUser(models.Model):
    # NOTE We might consider migrating the fields to CharField, which would
    # simplify form creation in forms.py
    first_name    = models.TextField()
    last_name     = models.TextField()
    email         = models.EmailField() #validators=[validate_email])
    password      = models.TextField()
    keypair       = models.TextField()
    authority_hrn = models.TextField()
    login         = models.TextField()
    created       = models.DateTimeField(auto_now_add = True)
    # models.ForeignKey(Institution)

class PendingAuthority(models.Model):
    site_name             = models.TextField()
    site_authority        = models.TextField() 
    site_abbreviated_name = models.TextField()
    site_url              = models.TextField()
    site_latitude         = models.TextField()
    site_longitude        = models.TextField()
    address_line1         = models.TextField()
    address_line2         = models.TextField()
    address_line3         = models.TextField()
    address_city          = models.TextField()
    address_postalcode    = models.TextField()
    address_state         = models.TextField()
    address_country       = models.TextField()
    # parent authority of the requested authority
    authority_hrn         = models.TextField()
    created               = models.DateTimeField(auto_now_add = True)
 
class PendingSlice(models.Model):
    slice_name      = models.TextField()
    user_email      = models.TextField()
    authority_hrn   = models.TextField(null=True)
    number_of_nodes = models.TextField(default=0)
    type_of_nodes   = models.TextField(default='NA')
    purpose         = models.TextField(default='NA')
    created         = models.DateTimeField(auto_now_add = True)
