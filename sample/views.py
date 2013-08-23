# -*- coding: utf-8 -*-
#
# sample/views.py: views for the sample application
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

from django.views.generic.base   import TemplateView
from myslice.viewutils           import topmenu_items, the_user

class WebSocketsView(TemplateView):
    template_name = "websockets.html"

    def get_context_data(self, **kwargs):
        # We might have slices on different registries with different user accounts 
        # We note that this portal could be specific to a given registry, to which we register users, but i'm not sure that simplifies things
        # Different registries mean different identities, unless we identify via SFA HRN or have associated the user email to a single hrn

        context = super(WebSocketsView, self).get_context_data(**kwargs)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'SAMPLE WEBSOCKET PAGE',
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        return context


class WebSockets2View(TemplateView):
    template_name = "websockets2.html"

    def get_context_data(self, **kwargs):
        # We might have slices on different registries with different user accounts 
        # We note that this portal could be specific to a given registry, to which we register users, but i'm not sure that simplifies things
        # Different registries mean different identities, unless we identify via SFA HRN or have associated the user email to a single hrn

        context = super(WebSockets2View, self).get_context_data(**kwargs)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'SAMPLE WEBSOCKET PAGE',
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        return context

