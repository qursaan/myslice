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
        else: 
            env['person'] = None
    
        env['theme'] = self.theme
    

        env['username']=the_user(request)

        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt

        return render_to_response(self.template, env, context_instance=RequestContext(request))

