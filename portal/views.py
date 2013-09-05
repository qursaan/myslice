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
from django.views.generic.base  import TemplateView
from django.shortcuts           import render
from django.template.loader     import render_to_string

from myslice.viewutils          import topmenu_items, the_user

from plugins.pres_view          import PresView
from portal.event               import Event

# these seem totally unused for now
#from portal.util                import RegistrationView, ActivationView

from portal.models              import PendingUser, PendingSlice
from portal.actions             import get_request_by_authority
from manifold.manifoldapi       import execute_query
from manifold.core.query        import Query
from unfold.page                import Page

# NOTE
# initially all the portal views were defined in this single file
# all the other ones have now migrated into separate classes/files for more convenience
# I'm leaving these ones here for now as I could not exactly figure what the purpose was 
# (i.e. what the correct name should be, as presviewview was a bit cryptic)
class PresViewView(TemplateView):
    template_name = "view-unfold1.html"

    def get_context_data(self, **kwargs):

        page = Page(self.request)

        pres_view = PresView(page = page)

        context = super(PresViewView, self).get_context_data(**kwargs)

        #context['ALL_STATIC'] = "all_static"
        context['unfold1_main'] = pres_view.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('PresView', self.request)
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
    return HttpResponse (json_answer, mimetype="application/json")

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
    return HttpResponse (json_answer, mimetype="application/json")

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
    return HttpResponse (json_answer, mimetype="application/json")

class ValidatePendingView(TemplateView):
    template_name = "validate_pending.html"

    def get_context_data(self, **kwargs):
        # We might have slices on different registries with different user accounts 
        # We note that this portal could be specific to a given registry, to which we register users, but i'm not sure that simplifies things
        # Different registries mean different identities, unless we identify via SFA HRN or have associated the user email to a single hrn

        #messages.info(self.request, 'You have logged in')
        page = Page(self.request)

        ctx_my_authorities = {}
        ctx_delegation_authorities = {}


        # The user need to be logged in
        if the_user(self.request):
            # Who can a PI validate:
            # His own authorities + those he has credentials for.
            # In MySlice we need to look at credentials also.
            

            # XXX This will have to be asynchroneous. Need to implement barriers,
            # for now it will be sufficient to have it working statically

            # get user_id to later on query accounts
            # XXX Having real query plan on local tables would simplify all this
            # XXX $user_email is still not available for local tables
            #user_query = Query().get('local:user').filter_by('email', '==', '$user_email').select('user_id')
            user_query = Query().get('local:user').filter_by('email', '==', the_user(self.request)).select('user_id')
            user, = execute_query(self.request, user_query)
            user_id = user['user_id']

            # Query manifold to learn about available SFA platforms for more information
            # In general we will at least have the portal
            # For now we are considering all registries
            all_authorities = []
            platform_ids = []
            sfa_platforms_query = Query().get('local:platform').filter_by('gateway_type', '==', 'sfa').select('platform_id', 'platform', 'auth_type')
            sfa_platforms = execute_query(self.request, sfa_platforms_query)
            for sfa_platform in sfa_platforms:
                print "SFA PLATFORM > ", sfa_platform['platform']
                if not 'auth_type' in sfa_platform:
                    continue
                auth = sfa_platform['auth_type']
                if not auth in all_authorities:
                    all_authorities.append(auth)
                platform_ids.append(sfa_platform['platform_id'])

            # We can check on which the user has authoritity credentials = PI rights
            credential_authorities = set()
            credential_authorities_expired = set()

            # User account on these registries
            user_accounts_query = Query.get('local:account').filter_by('user_id', '==', user_id).filter_by('platform_id', 'included', platform_ids).select('config')
            user_accounts = execute_query(self.request, user_accounts_query)
            #print "=" * 80
            #print user_accounts
            #print "=" * 80
            for user_account in user_accounts:
                config = json.loads(user_account['config'])
                creds = []
                if 'authority_credentials' in config:
                    for authority_hrn, credential in config['authority_credentials'].items():
                        #if credential is not expired:
                        credential_authorities.add(authority_hrn)
                        #else
                        #    credential_authorities_expired.add(authority_hrn)
                if 'delegated_authority_credentials' in config:
                    for authority_hrn, credential in config['delegated_authority_credentials'].items():
                        #if credential is not expired:
                        credential_authorities.add(authority_hrn)
                        #else
                        #    credential_authorities_expired.add(authority_hrn)

            print 'credential_authorities =', credential_authorities
            print 'credential_authorities_expired =', credential_authorities_expired

            # ** Where am I a PI **
            # For this we need to ask SFA (of all authorities) = PI function
            pi_authorities_query = Query.get('user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')
            pi_authorities_tmp = execute_query(self.request, pi_authorities_query)
            pi_authorities = set()
            for pa in pi_authorities_tmp:
                pi_authorities |= set(pa['pi_authorities'])

            print "pi_authorities =", pi_authorities
            
            # My authorities + I have a credential
            pi_credential_authorities = pi_authorities & credential_authorities
            pi_no_credential_authorities = pi_authorities - credential_authorities - credential_authorities_expired
            pi_expired_credential_authorities = pi_authorities & credential_authorities_expired
            # Authorities I've been delegated PI rights
            pi_delegation_credential_authorities = credential_authorities - pi_authorities
            pi_delegation_expired_authorities = credential_authorities_expired - pi_authorities

            print "pi_credential_authorities =", pi_credential_authorities
            print "pi_no_credential_authorities =", pi_no_credential_authorities
            print "pi_expired_credential_authorities =", pi_expired_credential_authorities
            print "pi_delegation_credential_authorities = ", pi_delegation_credential_authorities
            print "pi_delegation_expired_authorities = ", pi_delegation_expired_authorities

            # Summary intermediary
            pi_my_authorities = pi_credential_authorities | pi_no_credential_authorities | pi_expired_credential_authorities
            pi_delegation_authorities = pi_delegation_credential_authorities | pi_delegation_expired_authorities

            print "--"
            print "pi_my_authorities = ", pi_my_authorities
            print "pi_delegation_authorities = ", pi_delegation_authorities

            # Summary all
            queried_pending_authorities = pi_my_authorities | pi_delegation_authorities
            print "----"
            print "queried_pending_authorities = ", queried_pending_authorities

            requests = get_request_by_authority(queried_pending_authorities)
            for request in requests:
                auth_hrn = request['authority_hrn']

                if auth_hrn in pi_my_authorities:
                    dest = ctx_my_authorities

                    # define the css class
                    if auth_hrn in pi_credential_authorities:
                        request['allowed'] = 'allowed'
                    elif auth_hrn in pi_expired_credential_authorities:
                        request['allowed'] = 'expired'
                    else: # pi_no_credential_authorities
                        request['allowed'] = 'denied'

                elif auth_hrn in pi_delegation_authorities:
                    dest = ctx_delegation_authorities

                    if auth_hrn in pi_delegation_credential_authorities:
                        request['allowed'] = 'allowed'
                    else: # pi_delegation_expired_authorities
                        request['allowed'] = 'expired'

                else:
                    continue

                if not auth_hrn in dest:
                    dest[auth_hrn] = []
                dest[auth_hrn].append(request) 
        
        context = super(ValidatePendingView, self).get_context_data(**kwargs)
        context['my_authorities']   = ctx_my_authorities
        context['delegation_authorities'] = ctx_delegation_authorities

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        # XXX We need to prepare the page for queries
        #context.update(page.prelude_env())

        return context
