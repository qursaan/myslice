# -*- coding: utf-8 -*-
#
# sample/urls.py: URL mappings for the sample application
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

from django.conf.urls import patterns, url
from sample.views     import WebSocketsView, WebSockets2View

urlpatterns = patterns('',
    url(r'^websockets/?$', WebSocketsView.as_view(), name='websockets'),
    url(r'^websockets2/?$', WebSockets2View.as_view(), name='websockets2'),
)
