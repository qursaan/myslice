# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import FreeAccessView

from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from theme import ThemeView

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
        username = request.POST.get('username')
        password = request.POST.get('password')
       
        # LDAP form - If FIBRE, then get the possibilite to authenticate using usernameldap
        #if self.theme == 'fibre':
        usernameldap = request.POST.get('usernameldap')
        token = {'usernameldap': usernameldap, 'username': username ,'password': password, 'request': request}    
        #else:
        
        # Follow original code
        ## pass request within the token, so manifold session key can be attached to the request session.
        #token = {'username': username, 'password': password, 'request': request}    

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
            env['person'] = self.request.user
        else: 
            env['person'] = None
    
        env['theme'] = self.theme
    

        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        
        
        return render_to_response(self.template, env, context_instance=RequestContext(request))

