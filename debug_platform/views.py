# -*- coding: utf-8 -*-
#
# portal/views.py: views for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr>
#   Mohammed Yasin Rahman <mohammed-yasin.rahman@lip6.fr>
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

from django.conf                 import settings
from django.contrib.sites.models import Site, RequestSite
from django.contrib              import messages
from django.views.generic        import View
from django.views.generic.base   import TemplateView
from django.shortcuts            import render
from manifold.core.query         import Query
from unfold.page                 import Page
from ui.topmenu                  import topmenu_items, the_user
from django.http                 import HttpResponseRedirect
from plugins.debug_platform      import DebugPlatform

class PlatformView(TemplateView):
    template_name = "view-unfold1.html"

    def get_context_data(self, **kwargs):

        page = Page(self.request)

        debug_platform = DebugPlatform(page = page)

        context = super(PlatformView, self).get_context_data(**kwargs)

        context['ALL_STATIC'] = "all_static"
        context['unfold1_main'] = debug_platform.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        prelude_env = page.prelude_env()
        context.update(prelude_env)

        return context

