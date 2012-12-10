# Create your views here.
from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect

from auth.backend import MyCustomBackend

def login_user(request):
    state = "Please log in below..."
    username = password = ''
    env={'hard_wired_users':MyCustomBackend.hard_wired_users}
    
    if request.POST:
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                state = "You're successfully logged in!"
                return HttpResponseRedirect ('/')
            else:
                state = "Your account is not active, please contact the site admin."
                env['state']=state; env['username']=username
                return render_to_response('view-login.html',env, context_instance=RequestContext(request))
        else:
            state = "Your username and/or password were incorrect."
            env['state']=state; env['username']=username
            return render_to_response('view-login.html',env, context_instance=RequestContext(request))
    else:
        state='Welcome to MySlice'
        env['state']=state; env['username']=''
        return render_to_response('view-login.html',env, context_instance=RequestContext(request))

# hard question : where should we redirect requests to logout if user is not logged in ?
def logout_user (request):
    # xxx check that we're indeed logged in
    if not request.user.is_authenticated():
        return HttpResponseRedirect ('/')
    return render_to_response('view-logout.html',{},context_instance=RequestContext(request))

def do_logout_user (request):
    # xxx check that we're indeed logged in
    if not request.user.is_authenticated():
        return HttpResponseRedirect ('/')
    logout(request)
    return HttpResponseRedirect ('/')
        

