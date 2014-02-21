# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import FreeAccessView

from manifold.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from theme import ThemeView

class InstitutionView (FreeAccessView, ThemeView):
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
        else: 
            env['person'] = None
    
        env['theme'] = self.theme
    

        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        env['layout_1_or_2']="layout-unfold2.html" if not env['username'] else "layout-unfold1.html"
        
        
        return render_to_response(self.template, env, context_instance=RequestContext(request))

