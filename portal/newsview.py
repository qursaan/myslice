from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import FreeAccessView

from manifoldapi.manifoldresult import ManifoldResult
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView

class NewsView (FreeAccessView, ThemeView):
    template_name = 'news.html'

    def get (self, request, state=None):
        env = {}
        
        if request.user.is_authenticated(): 
            env['person'] = self.request.user
            env['username'] = self.request.user
        else: 
            env['person'] = None
            env['username'] = None
    
        env['theme'] = self.theme
        env['section'] = "News"

        return render_to_response(self.template, env, context_instance=RequestContext(request))

