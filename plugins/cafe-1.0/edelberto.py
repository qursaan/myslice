#!/usr/bin/env python


# XXX We need to clean it!!
from portal.models              import PendingUser

#Edelberto from manifoldauth
import os,sys
import subprocess
import shlex
import getpass
from hashlib import md5
import time
from random import randint
import crypt

import re
#from manifold.manifold.core.router import Router
from manifold.core.query                import Query
from manifoldapi.manifoldapi               import execute_admin_query, execute_query
#from portal.actions                     import manifold_add_user, manifold_add_account, manifold_update_account
#from portal.actions                     import manifold_add_account, manifold_add_reference_user_accounts, sfa_create_user, create_pending_user
from portal.actions                     import create_pending_user, create_user
from manifold.core.query import Query
# add user to manifold

from unfold.loginrequired   import FreeAccessView

from django.views.generic import View
from django.core.context_processors import csrf
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response

from manifoldapi.manifoldresult import ManifoldResult, ManifoldCode, ManifoldException
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

#from django.http import HttpResponse HttpResponseRedirect
from django.http import HttpResponse
#from django.http import HttpResponseRedirect
#from django.template import  RequestContext
from django.contrib.sessions.backends.db import SessionStore

from portal.homeview import HomeView

# View for authenticate the user
class EdelbertoView (HomeView):
    def get(self,request):
        env = self.default_env()
        env['theme'] = self.theme
        print "EdelbertoView"
    
    # XXX We use cookie!
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
        # Cookies test finish
       # return HttpResponse(ip)
    
        # expose this so we can mention the backend URL on the welcome page
        def default_env (self):
            return {
                     'MANIFOLD_URL':ConfigEngine().manifold_url(),
                     }
    
    
        # XXX It's only to test the association of pi and esilva@uff.br
        if request.session["eppn"] == 'esilva@uff.br':
            username = 'rezende@ufrj'
            password = 'fibre2014'
            print "eppn OK"
        # If the user is not esilva@uff.br, so run the normal authentication
        else:
            username = request.session["mail"]
            # XXX this is ugly. We generate a simple password merging mail "fibre" and sn.
            password = request.session["mail"] + "fibre" + request.session["sn"]
    
            # If we have " we remove
            username = username.replace('"','').strip()
            password = password.replace('"','').strip()
    
        # pass request within the token, so manifold session key can be attached to the request session.
        token = {'username': username, 'password': password, 'request': request}
    
        # . a ManifoldResult - when something has gone wrong, like e.g. backend is unreachable
        # . a django User in case of success
        # . or None if the backend could be reached but the authentication failed
        auth_result = authenticate(token=token)
        
        # XXX Error - We need a toke, not send parameters directly!
        #auth_result = authenticate(username='rezende@ufrj', password='fibre2014', request=request)
        print "Auth Result CAFe"
        print type(auth_result)
        # high-level errors, like connection refused or the like
    
        if isinstance (auth_result, ManifoldResult):
            manifoldresult = auth_result
            #htm =  "<meta http-equiv=\"refresh\" content=\"0; url=https://200.130.15.182/login\" />"
            htm = "not authenticated"
            return HttpResponse (htm)
            # user was authenticated at the backend
        elif auth_result is not None:
            user=auth_result
    
            # Verifying if user is active to logging in
            if user.is_active:
                print "LOGGING IN"
                login(request, user)
                
                #if request.user.is_authenticated():
                #    env['person'] = username
                #    env['username'] = username
                #else:
                #    env['person'] = None
    
                htm = "<meta http-equiv=\"refresh\" content=\"0; url=https://200.130.15.182/login\" />"
                #return HttpResponseRedirect ('/login-ok')
                return HttpResponse (htm)
                #return render_to_response(self.template,env, context_instance=RequestContext(request))
            else:
                # Today all CAFe accounts are actived
                htm = "Your account is not active, please contact the site admin."
                return HttpResponse (htm)
    
        # otherwise
        # Creating the user at manifold, myslice and sfa
        # XXX It's the first of CAFe user in MySlice!
        else:
            # Get the username and password
            user_params = { 'email': username, 'password': password }
            user_request = {}
    
            # set the auth_type = managed
            user_request['auth_type'] = 'managed'
    
            # XXX Generating the key pairs for CAFe user
            from Crypto.PublicKey import RSA
            private = RSA.generate(1024)
    
            # Example: private_key = '-----BEGIN RSA PRIVATE KEY-----\nMIIC...'
            # Example: public_key = 'ssh-rsa AAAAB3...'
            user_request['private_key'] = private.exportKey()
            user_request['public_key']  = private.publickey().exportKey(format='OpenSSH')
    
            # Generate a HRN different for all users (plus random int)
            # Getting the username
            splitmail = username.split("@")[0]
            # Getting the organization. The same of authority 
            # testbed name
            org = username.split('@')[1]
            o = org.split('.')[-2]     
            user = splitmail.replace('"','').strip()
            # Finally creating the HRN
            hrn = "fibre." + o + "." + user + str(randint(1,100000))
    
            user_request['user_hrn'] = hrn
    
            # Others fields we can get from CAFe database
            user_request['first_name'] = request.session['cn']
            user_request['last_name'] = request.session['sn']
            # We need to put the user below its authority
            user_request['authority_hrn'] = "fibre." + o
            user_request['email'] = username
            user_request['password'] = password
            user_request['public_key'] = user_request['public_key']
            user_request['private_key'] = user_request['private_key']
    
            # Verify in django if user exist
            if PendingUser.objects.filter(email__iexact = user_request['email']):
                htm = "Erro - User with same email from CAFe exists in Django"
            # verify in manifold and SFA if user exist
            user_query = Query().get('local:user').select('user_id','email')
            user_details = execute_admin_query(request, user_query)
            for user_detail in user_details:
                if user_detail['email'] == user_request['email']:
                    htm = "Erro - user exist in SFA Registry"
                try:
                    if user_detail['user_hrn'] == user_request['user_hrn']:
                        htm =  "Erro - user with the same hrn in SFA Registry"
                except:
                    continue
    
            # first we create a uer with pending flag
            create_pending_user(user_request, user_request, user_detail)
            # after we enable this user and put in SFA
            create_user(user_request, user_request)
    
            htm = "Now your CAFe user is associated with a MySlice account - Please return to the home and log in CAFe again."
            return HttpResponse(htm)
