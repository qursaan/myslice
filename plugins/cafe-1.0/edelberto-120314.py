#!/usr/bin/env python

#Edelberto from manifoldauth
import os,sys
import subprocess
import shlex
import getpass
from hashlib import md5
import time
from random import Random
import crypt

import re
#from manifold.manifold.core.router import Router
from manifold.core.query                import Query
from manifoldapi.manifoldapi               import execute_admin_query
from portal.actions                     import manifold_add_user, manifold_add_account, manifold_update_account
from manifold.core.query import Query
# add user to manifold

from django.views.generic import View
from django.core.context_processors import csrf
#from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response

from manifold.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

#from django.http import HttpResponse HttpResponseRedirect
from django.http import HttpResponse
#from django.http import HttpResponseRedirect
#from django.template import  RequestContext
from django.contrib.sessions.backends.db import SessionStore

def index(request):
#class EdelbertoView (View):

# =================== Old code - to validate =================
    '''
    ip = "<html><body>" 
    ip += "cn: " +  request.META['Shib-inetOrgPerson-cn'] + "</br>"
    ip += "sn: " +  request.META['Shib-inetOrgPerson-sn'] + "</br>"
    ip += "eppn: " + request.META['Shib-eduPerson-eduPersonPrincipalName'] + "</br>"
    ip += "mail: " + request.META['Shib-inetOrgPerson-mail'] + "</br>"
    ip += "Affiliation br: " + request.META['Shib-brEduPerson-brEduAffiliationType'] + "</br>"
    ip += "Affiliation edu: " + request.META['Shib-eduPerson-eduPersonAffiliation'] + "</br>"
    ip += "Auth-Method: " + request.META['Shib-Authentication-Method'] + "</br>"
    ip += "Identity Provider: " + request.META['Shib-Identity-Provider'] + "</br>"
    ip += "Application ID: " + request.META['Shib-Application-ID'] + "</br>"
    ip += "Session ID: " + request.META['Shib-Session-ID'] + "</br>"
    '''
# Test cookie support
    if request.session.test_cookie_worked():
    #if session.test_cookie_worked():
        return HttpResponse("Please enable cookies and try again.")
        #return
        print "Please enable cookies and try again."
    else:
        request.session['cn'] = request.META['Shib-inetOrgPerson-cn']
        request.session['sn'] = request.META['Shib-inetOrgPerson-sn']
        request.session['mail'] = request.META['Shib-inetOrgPerson-mail']
        request.session['eppn'] = request.META['Shib-eduPerson-eduPersonPrincipalName']
        #request.session['aff'] = request.META['Shib-brEduPerson-brEduAffiliationType']
        request.session['aff'] = request.META['Shib-eduPerson-eduPersonAffiliation']
	request.session['shib'] = request.META['Shib-Session-ID']

        if 'mail' in request.session.keys():
             print "Cookie: OK -> Content: cn:" + request.session["cn"] + " sn " +request.session["sn"] + " mail: " + request.session["mail"] + " eppn: " + request.session["eppn"]
             #ip += "Cookie: OK -> Content: cn:" + request.session["cn"] + " mail: " + request.session["mail"] + " eppn: " + request.session["eppn"]  + "</body></html>"
        else:
             print "Cookie: nothing/clear"
             #ip += "Cookie: nothing/clear </body></html>"
    
   # return HttpResponse(ip)
   

    # expose this so we can mention the backend URL on the welcome page
    def default_env (self):
        config=Config()
        return { 
                 'MANIFOLD_URL':config.manifold_url(),
                 }

    #def post (self,request):
    #    env = self.default_env()
        #username = request.POST.get('username')
        #password = request.POST.get('password')
    # if we use ABAC based on 'aff'
    #if 'aff' in request.session.keys():
    aff = request.session["aff"]
    # if we use ABAC - based on 'aff'
    #if aff == "student":
    # XXX It's only to test the association of admin and esilva@uff.br
    if request.session["eppn"] == 'esilva@uff.br':
        username = 'admin'
        password = 'admin'
    # For all users
    else:
        username = request.session["mail"]
 # this is ugly. We generate a simple password with merge of mail and a string.
        password = request.session["mail"] + "fibre2013"
     
        username = username.replace('"','').strip()
        password = password.replace('"','').strip()
    # pass request within the token, so manifold session key can be attached to the request session.
    token = {'username': username, 'password': password, 'request': request}    

        # our authenticate function returns either
        # . a ManifoldResult - when something has gone wrong, like e.g. backend is unreachable
        # . a django User in case of success
        # . or None if the backend could be reached but the authentication failed
    auth_result = authenticate(token=token)
        # high-level errors, like connection refused or the like
    
    if isinstance (auth_result, ManifoldResult):
        manifoldresult = auth_result
        # let's use ManifoldResult.__repr__
        '''
        env['state']="%s"%manifoldresult
        return render_to_response('home-view.html',env, context_instance=RequestContext(request))
    '''
        htm =  "<meta http-equiv=\"refresh\" content=\"0; url=https://sp-fibre.cafeexpresso.rnp.br/login-ok\" />"
        return HttpResponse (htm)    
        # user was authenticated at the backend
    elif auth_result is not None:
        user=auth_result
    
    if user.is_active:
        print "LOGGING IN"
        login(request, user)
        htm = "<meta http-equiv=\"refresh\" content=\"0; url=https://sp-fibre.cafeexpresso.rnp.br/login-ok\" />"
            #return HttpResponseRedirect ('/login-ok')
        return HttpResponse (htm)
    else:
        env['state'] = "Your account is not active, please contact the site admin."
        return render_to_response('home-view.html',env, context_instance=RequestContext(request))
    # otherwise
    else:
    '''
        magic = "$1$"
        password = password
        # Generate a somewhat unique 8 character salt string
        salt = str(time.time()) + str(Random().random())
        salt = md5(salt).hexdigest()[:8]

        if len(password) <= len(magic) or password[0:len(magic)] != magic:
        password = crypt.crypt(password.encode('latin1'), magic + salt + "$")

        user_params = {
            'email': username,
        'password': password
    }
    query = Query(action='create', object='local:user', params=user_params)


        # Instantiate a TopHat router
    with Router() as router:
        router.forward(query)
    '''
    #myArgs=[username,password]
    #os.spawnlp(os.P_WAIT,'/tmp/adduser.py', username, password, '/bin/bash/'i)
    #command = '/var/www/manifold/manifold/bin/adduser.py ' + username + ' ' + password
    #command = 'ls -la'
            #args = shlex.split(command)
            #p = subprocess.Popen(args, stdin=subprocess.PIPE).communicate()[0]
        #print command
        #print args
        #print p
    #env['state'] = "Now your CAFe user is associated to your MySlice account - Please logging in CAFe again."
    #return render_to_response('home-view.html',env, context_instance=RequestContext(request))
    user_params = { 'email': username, 'password': password }
    manifold_add_user(request,user_params)
    
    #query = Query().get('user').filter_by('email', '=', username).select('user_id')
    #user = execute_admin_query(request,query)
    #print "USER_ID:" + user
    #user_id = user['user_id']
    #user_id = user[0]
    #print user_id
    #splitmail = username.split("@")[0]
    #user_params = { 'user': splitmail, 'platform': 'myslice' }
    #user_params = { 'user_id': '2', 'platform_id': '2' }
    #manifold_add_account(request,user_params)

    # Ugly! Forcing the association of user and platform. This need to be automatic. 	
    splitmail = username.split("@")[0]
    user = splitmail.replace('"','').strip()
    hrn = "fibrebr.dummy." + user
    user_hrn = '{ "user_hrn": "'+ hrn +'" }'
    #user_params = { 'config': user_hrn, 'auth_type': 'managed' }
    user_params2 = { 'user_id': '2', 'platform_id': '2', 'config': user_hrn, 'auth_type': 'managed' }
    manifold_add_account(request,user_params2)

    ##user_id = '3'
    #manifold_update_account(request,user_params)
    html = "Now your CAFe user is associated with a MySlice account - Please login in CAFe again."
    return HttpResponse(html)

     # If we use ABAC - based on 'aff'
     #   else:
	 #   #env['state'] = "Your affiliation (" + request.session["aff"] + ") at CAFe is not accepted."
	 #   html = "Your CAFe affiliation (" + request.session["aff"] + ") is not accepted. <br> Only \"student\" affiliation."
	 #   return HttpResponse(html)
	    #return render_to_response('home-view.html',env, context_instance=RequestContext(request))
	    

	    # login-ok sets state="Welcome to MySlice" in urls.py
	def get (self, request, state=None):
	    env = self.default_env()
	    env['username']=the_user(request)
	    env['topmenu_items'] = topmenu_items(None, request)
	    if state: env['state'] = state
	    elif not env['username']: env['state'] = "Please sign in"
	    return HttpResponseRedirect ('/login-ok')
	#return render_to_response('home-view.html',env, context_instance=RequestContext(request))