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

import json

from django.http                import HttpResponseRedirect, HttpResponse
from django.shortcuts           import render
from django.template.loader     import render_to_string
from manifold.core.query        import Query
from plugins.myplugin           import MyPlugin
from plugins.maddash            import MadDash
from ui.topmenu                 import topmenu_items_live, the_user
from unfold.loginrequired       import FreeAccessView
from unfold.page                import Page

# NOTE
# initially all the portal views were defined in this single file
# all the other ones have now migrated into separate classes/files for more convenience
# I'm leaving these ones here for now as I could not exactly figure what the purpose was 
# (i.e. what the correct name should be, as presviewview was a bit cryptic)
class MyPluginView(FreeAccessView):
    template_name = "view-unfold1.html"

    def get_context_data(self, **kwargs):

        page = Page(self.request)

        plugin = MyPlugin(page = page)
        context = super(MyPluginView, self).get_context_data(**kwargs)
        context['unfold_main'] = plugin.render(self.request)

        # more general variables expected in the template
        context['title'] = 'Sandbox for MyPlugin plugin'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('myplugin', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        prelude_env = page.prelude_env()
        context.update(prelude_env)

        return context


class MadDashView(FreeAccessView):
    template_name = "view-unfold1.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)

        # This will simulate fake records in order to test the plugin
        fake_query = Query.get('ping').select('hrn', 'src_hostname', 'dst_hostname', 'delay')
        fake_query_all = Query.get('ping').select('hrn', 'src_hostname', 'dst_hostname', 'delay')

        generators = {
            'hrn': 'random_string',
            'src_hostname': 'random_string',
            'dst_hostname': 'random_string',
            'delay': 'random_int'
        }
        page.generate_records(fake_query, generators, 5)
        page.generate_records(fake_query_all, generators, 20)

        plugin = MadDash(query = fake_query, query_all = fake_query_all, page = page)
        context = super(MadDashView, self).get_context_data(**kwargs)
        context['unfold_main'] = plugin.render(self.request)
        context['title'] = 'Sandbox for MadDash plugin'
        context['topmenu_items'] = topmenu_items_live ('maddash', page)
        context['username'] = the_user(self.request)

        prelude_env = page.prelude_env()
        context.update(prelude_env)

        return context

