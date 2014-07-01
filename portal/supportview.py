# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render
import json
from unfold.loginrequired import FreeAccessView

from manifoldapi.manifoldresult import ManifoldResult
from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView

class SupportView (FreeAccessView, ThemeView):
    template_name = 'supportview.html'
        
    

    def post (self,request):
        env = {}
        env['theme'] = self.theme
        return render_to_response(self.template, env, context_instance=RequestContext(request))

    def get (self, request, state=None):
        env = {}

        if request.user.is_authenticated(): 
            env['person'] = self.request.user
            ## check user is pi or not
            platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
            account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
            platform_details = execute_query(self.request, platform_query)
            account_details = execute_query(self.request, account_query)
            for platform_detail in platform_details:
                for account_detail in account_details:
                    if platform_detail['platform_id'] == account_detail['platform_id']:
                        if 'config' in account_detail and account_detail['config'] is not '':
                            account_config = json.loads(account_detail['config'])
                            if 'myslice' in platform_detail['platform']:
                                acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
            # assigning values
            if acc_auth_cred == {}:
                pi = "is_not_pi"
            else:
                pi = "is_pi"
            env['pi'] = pi
        else: 
            env['person'] = None
    
        env['theme'] = self.theme
        env['section'] = "Support"

        env['username']=the_user(request)

        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt

        return render_to_response(self.template, env, context_instance=RequestContext(request))

