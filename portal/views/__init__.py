# -*- coding: utf-8 -*-
#
# portal/views.py: views for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr>
#   Mohammed Yasin Rahman <mohammed-yasin.rahman@lip6.fr>
#   Loic Baron <loic.baron@lip6.fr>
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

from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items_live, the_user

from portal.event               import Event
# presview is put in observation for now
#from plugins.pres_view          import PresView
from plugins.raw                import Raw

# these seem totally unused for now
#from portal.util                import RegistrationView, ActivationView

from portal.models              import PendingUser, PendingSlice
from portal.actions             import get_requests
from manifoldapi.manifoldapi    import execute_query
from manifold.core.query        import Query
from unfold.page                import Page

# NOTE
# initially all the portal views were defined in this single file
# all the other ones have now migrated into separate classes/files for more convenience
# I'm leaving these ones here for now as I could not exactly figure what the purpose was 
# (i.e. what the correct name should be, as presviewview was a bit cryptic)
class PresViewView(FreeAccessView):
    template_name = "view-unfold1.html"

    def get_context_data(self, **kwargs):

        page = Page(self.request)

#        pres_view = PresView(page = page)
        pres_view = Raw(page = page,html="<h1>PresView needs to be integrated</h1>")

        context = super(PresViewView, self).get_context_data(**kwargs)

        #context['ALL_STATIC'] = "all_static"
        context['unfold_main'] = pres_view.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('PresView', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        prelude_env = page.prelude_env()
        context.update(prelude_env)

        return context

def json_me(config_file,type):
    json_answer = ''
    for ligne in config_file:
        if not ligne.startswith('#'):
            args = ligne.split(';')
            json_answer += str('{ "name": "' + args[0] + '" ,"id":"' + args[1]  + '" ,"descriptif":"' + args[2]+'"')
            if type!="dynamic":
                json_answer += str(',"contraints":')
                if args[3]=="":
                    json_answer += str('""')
                else:
                    json_answer += str(args[3])
            json_answer += str('},')
    return json_answer[:-1]


DIR = '/var/myslice/'
STATIC = '%s/config_method_static' % DIR
DYNAMIC = '%s/config_method_dynamic' % DIR
ANIMATION = '%s/config_method_animation' % DIR

def pres_view_methods(request, type):

    if type ==None:
        return 0
    elif type =="static":
        config = open(STATIC, "r")
        json_answer = str('{ "options": [')
        json_answer += str(json_me(config,"static"))
        json_answer += str('] }')
        config.close()
    elif type =="dynamic":
        config = open(DYNAMIC, "r")
        json_answer = str('{ "options": [')
        json_answer += str(json_me(config,"dynamic"))
        json_answer += str('] }')
        config.close()
    elif type =="animation":
        config = open(ANIMATION, "r")
        json_answer = str('{ "options": [')
        json_answer += str(json_me(config,"animation"))
        json_answer += str('] }')
        config.close()
    elif type =="all":
        config = open(STATIC, "r")
        json_answer = str('{ "static": [')
        json_answer += str(json_me(config,"static"))
        json_answer += str('],')
        json_answer += str('"dynamic": [')
        config.close()
        config = open(DYNAMIC, "r")
        json_answer += str(json_me(config,"dynamic"))
        json_answer += str('],')
        json_answer += str('"animation": [')
        config.close()
        config = open(ANIMATION, "r")
        json_answer += str(json_me(config,"animation"))
        json_answer += str('] }')
        config.close()
    else:
        return 0
    return HttpResponse (json_answer, content_type="application/json")

def pres_view_animation(request, constraints, id):

# sites crees depuis 2008
# static.py?contraints=']date_created':1262325600&id='name_id"'

    # method = request.getvalue('method') #ex : GetSites
    #constraints = "']date_created':1262325600"
    #id = "2"

    if id == None:
        return 0

    # method = 'GetSites'#request.getvalue('method') #ex : GetSites
    # constraints = {}#request.getvalue('constraints') // nul = {}
    # response_field = "'site_id','name','date_created'"#request.getvalue('response_field')

    config_file = open(ANIMATION, "r")
    for ligne in config_file:
        if not ligne.startswith('#'):
            ligne = ligne.split('\n')
            first = ligne[0].split(';')
            if (str(first[1]) == str(id)):
                save = first
    config_file.close()

    #Les print_method, print_option sont definis par le client (js)
    #Les animations acceptent que les connexions anonymous
    # args = "postmsg;animation;;;anonymous;https://www.planet-lab.eu/PLCAPI/;"
    args = ";;"+str(save[8])+";"+str(save[9])+";anonymous;"+str(save[5])+";"+str(save[6])+";{"+str(constraints)+"};"+str(save[7])+";"


    #Creation d'un objet event
    event = Event(args)
    cmd = [{"params": {
            "data": {
                "print_options": event.print_options,
                "print_method": event.print_method,
                "message": event.data
            }
        }
    }]

    json_answer = json.dumps(cmd)
    return HttpResponse (json_answer, content_type="application/json")

def pres_view_static(request, constraints, id):
    #constraints = "']date_created':1262325600"
    #id = "2"

    # method = 'GetSites'#request.getvalue('method') #ex : GetSites
    # constraints = {}#request.getvalue('constraints') // nul = {}
    # response_field = "'site_id','name','date_created'"#request.getvalue('response_field')

    config_file = open(STATIC, "r")
    for ligne in config_file:
        if not ligne.startswith('#'):
            ligne = ligne.split('\n')
            first = ligne[0].split(';')
            if (str(first[1]) == str(id)):
                save = first
    config_file.close()

    #Les print_method, print_option sont definis par le client (js)
    #Les animations acceptent que les connexions anonymous
    # args = "postmsg;animation;;;anonymous;https://www.planet-lab.eu/PLCAPI/;"
    args = ";;"+str(save[8])+";"+str(save[9])+";anonymous;"+str(save[5])+";"+str(save[6])+";{"+str(constraints)+"};"+str(save[7])+";"


    #Creation d'un objet event
    event = Event(args)
    cmd = [{"params": {
            "data": {
                "print_options": event.print_options,
                "print_method": event.print_method,
                "message": event.data
            }
        }
    }]

    json_answer = json.dumps(cmd)
    return HttpResponse (json_answer, content_type="application/json")
