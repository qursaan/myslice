from django.core.context_processors import csrf
from django.http                    import HttpResponseRedirect
from django.contrib.auth            import authenticate, login, logout
from django.template                import RequestContext
from django.shortcuts               import render_to_response
from django.shortcuts               import render

from unfold.loginrequired           import LoginRequiredAutoLogoutView

from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_query
from manifoldapi.manifoldresult     import ManifoldResult
from ui.topmenu                     import topmenu_items, the_user
from myslice.configengine           import ConfigEngine

from myslice.theme                          import ThemeView
import json

class InstitutionView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'institution.html'
        
    # expose this so we can mention the backend URL on the welcome page
    def default_env (self):
        return { 
                 'MANIFOLD_URL':ConfigEngine().manifold_url(),
                 }

    def post (self,request):
        env = self.default_env()
        env['theme'] = self.theme
        return render_to_response(self.template, env, context_instance=RequestContext(request))

    def get (self, request, state=None):
        env = self.default_env()

        if request.user.is_authenticated(): 
            env['person'] = self.request.user
            user_query  = Query().get('user').select('user_hrn','parent_authority').filter_by('user_hrn','==','$user_hrn')
            user_details = execute_query(self.request, user_query)
            try:
                env['user_details'] = user_details[0]
            except Exception,e:
                env['error'] = "Please check your Credentials"
            
            try:
                user_local_query  = Query().get('local:user').select('config').filter_by('email','==',str(env['person']))
                user_local_details = execute_query(self.request, user_local_query)
                user_local = user_local_details[0]            
                user_local_config = user_local['config']
                user_local_config = json.loads(user_local_config)
                user_local_authority = user_local_config.get('authority')
                if 'user_details' not in env or 'parent_authority' not in env['user_details'] or env['user_details']['parent_authority'] is None:
                    env['user_details'] = {'parent_authority': user_local_authority}
            except Exception,e:
                env['error'] = "Please check your Manifold user config"
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

        else: 
            env['person'] = None
    
        env['theme'] = self.theme
        env['section'] = "Institution"
        env['pi'] = pi 
        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        env['layout_1_or_2']="layout-unfold2.html" if not env['username'] else "layout-unfold1.html"
        
        
        return render_to_response(self.template, env, context_instance=RequestContext(request))

