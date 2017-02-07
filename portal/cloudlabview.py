import json
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import LoginRequiredAutoLogoutView
from manifold.core.query     import Query
from manifoldapi.manifoldapi import execute_query

from manifoldapi.manifoldresult import ManifoldResult
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView
from myslice.settings                   import logger

class CloudView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'cloudlab.html'

    def get (self, request, state=None):
        env = {}
        pkey = None
        cert = None
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        account_details = execute_query(self.request, account_query)
        # Get the accounts of the current logged in user
        for account_detail in account_details:
            try:
                account_config = json.loads(account_detail['config'])
                if 'user_private_key' in account_config:
                    pkey = account_config['user_private_key']
                if 'gid' in account_config:
                    cert = account_config['gid']
            except ValueError as e:
                print('not a JSON')

        env['supername'] = 'Amira'
        env['cert'] = cert
        env['key'] = pkey                                                      
        if request.user.is_authenticated(): 
            env['person'] = self.request.user
            env['username'] = self.request.user
        else: 
            env['person'] = None
            env['username'] = None
    
        env['theme'] = self.theme
        env['section'] = ""

        return render_to_response(self.template_name, env, context_instance=RequestContext(request))

