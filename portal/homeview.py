# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render
import json

from unfold.loginrequired import FreeAccessView

from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query

from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView

class HomeView (FreeAccessView, ThemeView):
    template_name = 'home-view.html'
        
    # expose this so we can mention the backend URL on the welcome page
    def default_env (self):
        return { 
                 'MANIFOLD_URL':ConfigEngine().manifold_url(),
                 }

    def post (self,request):
        env = self.default_env()
        env['theme'] = self.theme
        env['section'] = "Dashboard"
        
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # pass request within the token, so manifold session key can be attached to the request session.
        token = {'username': username, 'password': password, 'request': request}    

        # our authenticate function returns either
        # . a ManifoldResult - when something has gone wrong, like e.g. backend is unreachable
        # . a django User in case of success
        # . or None if the backend could be reached but the authentication failed
        auth_result = authenticate(token=token)
        # use one or two columns for the layout - not logged in users will see the login prompt
        # high-level errors, like connection refused or the like
        if isinstance (auth_result, ManifoldResult):
            manifoldresult = auth_result
            # let's use ManifoldResult.__repr__
            env['state']="%s"%manifoldresult
            
            return render_to_response(self.template,env, context_instance=RequestContext(request))
        # user was authenticated at the backend
        elif auth_result is not None:
            user=auth_result
            if user.is_active:
                print "LOGGING IN"
                login(request, user)
                
                if request.user.is_authenticated(): 
                    env['person'] = self.request.user
                    env['username'] = self.request.user
                    
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
                    if acc_auth_cred=={} or acc_auth_cred=='N/A':
                        pi = "is_not_pi"
                    else:
                        pi = "is_pi"

                    env['pi'] = pi                
                else: 
                    env['person'] = None
                return render_to_response(self.template,env, context_instance=RequestContext(request))
            else:
                env['state'] = "Your account is not active, please contact the site admin."
                env['layout_1_or_2']="layout-unfold2.html"
                
                return render_to_response(self.template,env, context_instance=RequestContext(request))
        # otherwise
        else:
            env['state'] = "Your username and/or password were incorrect."
            
            return render_to_response(self.template, env, context_instance=RequestContext(request))

    def get (self, request, state=None):
        env = self.default_env()
        if request.user.is_authenticated():
            ## check user is pi or not
            platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
            account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
            # XXX Something like an invalid session seems to make the execute fail sometimes, and thus gives an error on the main page
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
            if acc_auth_cred=={} or acc_auth_cred=='N/A':
                pi = "is_not_pi"
            else:
                pi = "is_pi"

            env['pi'] = pi     
            env['person'] = self.request.user
        else: 
            env['person'] = None

        env['theme'] = self.theme
        env['section'] = "Dashboard"


        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        
#         account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
#         account_details = execute_query(self.request, account_query)
#         for account_detail in account_details:
#             account_config = json.loads(account_detail['config'])
#             platform_name = platform_detail['platform']
#             if 'myslice' in platform_detail['platform']:
#                 acc_user_cred = account_config.get('delegated_user_credential','N/A')
#                 acc_slice_cred = account_config.get('delegated_slice_credentials','N/A')
#                 acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
# 
#                 if 'N/A' not in acc_user_cred:
#                     exp_date = re.search('<expires>(.*)</expires>', acc_user_cred)
#                     if exp_date:
#                         user_exp_date = exp_date.group(1)
#                         user_cred_exp_list.append(user_exp_date)
# 
#                     my_users = [{'cred_exp': t[0]}
#                         for t in zip(user_cred_exp_list)]
#                
# 
#                 if 'N/A' not in acc_slice_cred:
#                     for key, value in acc_slice_cred.iteritems():
#                         slice_list.append(key)
#                         # get cred_exp date
#                         exp_date = re.search('<expires>(.*)</expires>', value)
#                         if exp_date:
#                             exp_date = exp_date.group(1)
#                             slice_cred_exp_list.append(exp_date)
# 
#                     my_slices = [{'slice_name': t[0], 'cred_exp': t[1]}
#                         for t in zip(slice_list, slice_cred_exp_list)]
# 
#                 if 'N/A' not in acc_auth_cred:
#                     for key, value in acc_auth_cred.iteritems():
#                         auth_list.append(key)
#                         #get cred_exp date
#                         exp_date = re.search('<expires>(.*)</expires>', value)
#                         if exp_date:
#                             exp_date = exp_date.group(1)
#                             auth_cred_exp_list.append(exp_date)

        
        return render_to_response(self.template, env, context_instance=RequestContext(request))

