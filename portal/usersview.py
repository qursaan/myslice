from django.contrib.auth        import authenticate, login, logout
from django.template            import RequestContext
from django.shortcuts           import render, render_to_response

from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu                 import topmenu_items, the_user
from myslice.configengine       import ConfigEngine
from manifold.core.query        import Query
from unfold.page                import Page
from manifoldapi.manifoldapi    import execute_admin_query
from unfold.loginrequired       import LoginRequiredAutoLogoutView

from myslice.theme import ThemeView
import json

class UsersView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'usersview.html'
        
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
        

        email_list = []
        status_list = []
        authority_list = []
        config={}

        user_query  = Query().get('local:user').select('email','status','config')
        user_details = execute_admin_query(self.request, user_query)

        for user in user_details:
            # get email
            email_list.append(user['email'])
            # get status
            if user['status'] == 0:
                user_status = 'Disabled'
            elif user['status'] == 1:
                user_status = 'Validation Pending'
            elif user['status'] == 2:
                user_status = 'Enabled'
            else:
                user_status = 'N/A'

            status_list.append(user_status)
            #get authority
            #if user['config']:
            user_config = json.loads(user['config'])
            user_authority = user_config.get('authority','N/A')
            authority_list.append(user_authority)
    
        user_list = [{'email': t[0], 'status': t[1], 'authority':t[2]}
            for t in zip(email_list, status_list, authority_list)]

        if request.user.is_authenticated(): 
            env['person'] = self.request.user
        else: 
            env['person'] = None
    
        env['theme'] = self.theme
        env['user_list']= user_list

        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        env['layout_1_or_2']="layout-unfold2.html" if not env['username'] else "layout-unfold1.html"
        
        
        return render_to_response(self.template, env, context_instance=RequestContext(request))

