# this somehow is not used anymore - should it not be ?
from django.views.generic import View
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response

from myslice.viewutils import topmenu_items, the_user
from myslice.config import Config

class HomeView (View):

    def default_env (self):
        return { 
                 'manifold_url':Config.manifold_url,
                 }

    def post (self,request):
        env = self.default_env()
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # pass request within the token, so manifold session key can be attached to the request session.
        token = {'username': username, 'password': password, 'request': request}    

        user = authenticate(token=token)
        if user is not None:
            if user.is_active:
                print "LOGGING IN"
                login(request, user)
                return HttpResponseRedirect ('/login-ok')
            else:
                env['state'] = "Your account is not active, please contact the site admin."
                return render_to_response('home-view.html',env, context_instance=RequestContext(request))
        else:
            env['state'] = "Your username and/or password were incorrect."
            return render_to_response('home-view.html',env, context_instance=RequestContext(request))

    # login-ok sets state="Welcome to MySlice" in urls.py
    def get (self, request, state=None):
        env = self.default_env()
        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items('', request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = "Please sign in"
        return render_to_response('home-view.html',env, context_instance=RequestContext(request))

