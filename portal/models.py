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

from django.db import models

# Create your models here.

class Institution(models.Model):
    name = models.TextField()
    # list of associated email domains 

class PendingUser(models.Model):
    # NOTE We might consider migrating the fields to CharField, which would
    # simplify form creation in forms.py
    first_name  = models.TextField()
    last_name   = models.TextField()
    email       = models.TextField()
    password    = models.TextField()
    keypair     = models.TextField()
    # institution

class PendingSlice(models.Model):
    slice_name  = models.TextField()
