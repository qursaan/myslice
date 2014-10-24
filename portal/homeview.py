# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

import json

from unfold.loginrequired import FreeAccessView

from manifold.core.query                import Query
#from manifoldapi.manifoldapi            import execute_query
# LDAP query admin // If transfer this code to actions.py maybe don't need more execute_admin_query
from manifoldapi.manifoldapi            import execute_query, execute_admin_query
# Edelberto - LDAP XXX
from portal.models		import PendingUser
from django.contrib.auth.models import User   #Pedro
from portal.actions             import create_pending_user, create_user, create_user_in_ldap, clear_user_creds
from registrationview 		import RegistrationView
from random     import randint
from hashlib    import md5
from django.contrib.sites.models import Site
import os.path, re
##################


from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView

# Edelberto LDAP authentication XXX
import ldap

#import activity.user

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
        env['section'] = "Dashboard"
        
        username = request.POST.get('username').lower()
        password = request.POST.get('password')
       
        # LDAP form - If FIBRE, then get the possibilite to authenticate using usernameldap
        #if self.theme == 'fibre':
        #usernameldap = request.POST.get('usernameldap')
        #token = {'usernameldap': usernameldap, 'username': username ,'password': password, 'request': request}    

	##################################################
	########## XXX  Edelberto 010914 XXX
	#################################################
	## first you must open a connection to the server
	try:
		# Connect to NOC
                l = ldap.initialize("ldap://200.130.15.186:389")
		# Bind/authenticate with a root user to search all objects
		l.simple_bind_s("cn=Manager,dc=br,dc=fibre","fibre2013")
		
		l.protocol_version = ldap.VERSION3
	except ldap.LDAPError, e:
		print e

	## Base directory
	baseDN = "dc=fibre"
	searchScope = ldap.SCOPE_SUBTREE
	## retrieve all attributes
	retrieveAttributes = None
	#retrieveAttributes = ['userEnable']
	searchFilter = "uid=" + username
	print searchFilter

        in_ldap = 0

	try:
            if username != "admin":
		ldap_result_id = l.search(baseDN, searchScope, searchFilter, retrieveAttributes)
		result_set = []
		result_type, result_data = l.result(ldap_result_id, 0)
		if (result_data == []):
			print "User doesnt exist in LDAP"
			in_ldap = 0
		else:
			if result_type == ldap.RES_SEARCH_ENTRY:
				result_set.append(result_data)
			else:
				result_set.append(result_data)
			# TRUE or FALSE for userEnable attribute
	        	userEnable = result_set[0][0][1]['userEnable'][0]
			if userEnable == 'TRUE':
				in_ldap = 1
				enabled = 1
				print "In LDAP and Enabled"

				dn = result_set[0][0][0]
				try:
					l.simple_bind_s(dn,password)
					pwd = 1
					print "User password OK"

				except:
					pwd = 0
					print "User password WRONG"

				if in_ldap and enabled and pwd:
					ldap_mail = result_set[0][0][1]['mail'][0]

					user_exists =  Query().get('local:user')             \
						.select('status') \
						.filter_by('email', '==', username)
					results = execute_admin_query(request, user_exists)
					print "DEBUG: %s" % user_exists
					if results:
						print "DEBUG: user exists on MySlice DBs"
					else:
						print "DEBUG: user NOT exists on MySlice DBs"
						
						cn 		= result_set[0][0][1]['cn'][0] 
						sn 		=  result_set[0][0][1]['sn'][0]

                                                fname=None
                                                lname=None

                                                try:
                                                    fname =  sn.split(' ')[0]
                                                    lname =  sn.split(' ')[1]
                                                except:
                                                    fname = sn
                                                    lname = ""

						#authority_hrn 	=  'fibre' + '.' + username.split('@')[1] 
						authority_hrn 	=  'fibre'
						print authority_hrn
						email		= ldap_mail
						print ldap_mail
						username 	= username
						print username
						password	= password
						print password
						# user_hrn	= 'fibre' + '.' + username.split('@')[1] + '.' + username
						user_hrn	= 'fibre' + '.' + username
						print user_hrn

						# Based on registrationview


						# get the domain url
						current_site = Site.objects.get_current()
            					current_site = current_site.domain
						print current_site

					    	post_email = ldap_mail
					    	salt = randint(1,100000)
					    	email_hash = md5(str(salt)+post_email).hexdigest()
						print email_hash

					    	user_request = {
						'first_name'    : fname,
						'last_name'     : lname,
						'organization'  : authority_hrn,
						'authority_hrn' : authority_hrn,
						'email'         : ldap_mail,
						'username'      : username,
						'password'      : password,
						'current_site'  : current_site,
						'email_hash'    : email_hash,
						'pi'            : '',
						'user_hrn'	: user_hrn,
                                                'reasons'       : 'already exists in the LDAP',
						'type'		: 'user',
						'validation_link': 'https://' + current_site + '/portal/email_activation/'+ email_hash
					    	}

				 		# Validate input
						errors = []
					    	UserModel = get_user_model()
					    	if (re.search(r'^[\w+\s.@+-]+$', user_request['first_name']) == None):
							errors.append('First name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
					    	if (re.search(r'^[\w+\s.@+-]+$', user_request['last_name']) == None):
							errors.append('Last name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
					    	if (re.search(r'^[\w,]+$' , username) == None):
							errors.append('Username may contain only letters,numbers and -/_ characters.')
					    	# checking in django_db !!
					    	if PendingUser.objects.filter(email__iexact = user_request['email']):
							errors.append('Email is pending for validation. Please provide a new email address.')
					    	if User.objects.filter(username__iexact = user_request['username']):
							errors.append('This username is already in use, try another one')
					    	# Does the user exist in Manifold?
					    	user_query  = Query().get('local:user').select('user_id','email')
					    	user_details = execute_admin_query(request, user_query)
					    	for user_detail in user_details:
							if user_detail['email'] == user_request['email']:
						    		errors.append('Email already registered in Manifold. Please provide a new email address.')
					    	# Does the user exist in sfa? [query is very slow!!]
					    	#user_query  = Query().get('user').select('user_hrn','user_email')
					    	# XXX Test based on the user_hrn is quick
					    	#user_query  = Query().get('user').select('user_hrn','user_email').filter_by('user_hrn','==',user_request['user_hrn'])
					    	user_query  = Query().get('user').select('user_hrn','user_email').filter_by('user_hrn','==',user_hrn)
					    	user_details_sfa = execute_admin_query(request, user_query)

					    	#if 'generate' in wsgi_request.POST['question']:
					    	user_request['auth_type'] = 'managed'

						# XXX Common code, dependency ?
						from Crypto.PublicKey import RSA
						private = RSA.generate(1024)

						# Example: private_key = '-----BEGIN RSA PRIVATE KEY-----\nMIIC...'
						# Example: public_key = 'ssh-rsa AAAAB3...'
						user_request['private_key'] = private.exportKey()
						user_request['public_key']  = private.publickey().exportKey(format='OpenSSH')

						# XXX Verify if errors exist - After!
					    	#if not errors:
						create_user_in_ldap(request, user_request, user_detail)
						#create_pending_user(request, user_request, user_detail)

                                                #create_user(request, user_request)
                                                            
                                                env['state'] = "LDAP associated. Please, login again."
                                                return render_to_response(self.template, env, context_instance=RequestContext(request))
                                                        

				else:
            				env['state'] = "Access denied. Verify LDAP userEnable and password."
            				return render_to_response(self.template, env, context_instance=RequestContext(request))

			else:
				in_ldap = 1
				enabled = 0
				print "In LDAP but Disabled"
            			env['state'] = "Access denied. Verify LDAP userEnable."
            			return render_to_response(self.template, env, context_instance=RequestContext(request))

	#print result_set
	except ldap.LDAPError, e:
		print e	

        #else:
	if in_ldap and enabled and pwd or username=="admin":

################################################################################
### XXX Edelberto LDAP auth end XXX
###############################################################################        
		# Follow original code
		## pass request within the token, so manifold session key can be attached to the request session.
		token = {'username': username, 'password': password, 'request': request}    

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
			    
			    ## check user is pi or not
			    platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
			    account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')

			    # Edleberto
			    #cc_auth_cred = {}		

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
			    if acc_auth_cred=={} or acc_auth_cred=='N/A':
				pi = "is_not_pi"
			    else:
				pi = "is_pi"
			    env['pi'] = pi                
			else: 
			    env['person'] = None
			return render_to_response(self.template,env, context_instance=RequestContext(request))
		    else:
			env['state'] = "Your account is not active, please contact the site admin."
			env['layout_1_or_2']="layout-unfold2.html"
			
			return render_to_response(self.template,env, context_instance=RequestContext(request))
		# otherwise
        else:
            # log user activity
            #activity.user.login(self.request, "error")
            env['state'] = "Your username and/or password were incorrect."
            
            return render_to_response(self.template, env, context_instance=RequestContext(request))

    def get (self, request, state=None):
        env = self.default_env()
        acc_auth_cred={}
        if request.user.is_authenticated():
           
            ## check user is pi or not
            platform_details = {}
            account_details = {}
            acc_auth_cred = {}
            acc_user_cred = {}
            platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
            account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
            # XXX Something like an invalid session seems to make the execute fail sometimes, and thus gives an error on the main page
            platform_details = execute_query(self.request, platform_query)
            account_details = execute_query(self.request, account_query)
            if platform_details is not None and platform_details != {}:
                for platform_detail in platform_details:
                    for account_detail in account_details:
                        if 'platform_id' in platform_detail:
                            if platform_detail['platform_id'] == account_detail['platform_id']:
                                if 'config' in account_detail and account_detail['config'] is not '':
                                    account_config = json.loads(account_detail['config'])
                                    if 'myslice' in platform_detail['platform']:
                                        acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
                                        acc_user_cred = account_config.get('delegated_user_credential','N/A')
            # assigning values
            if acc_auth_cred=={} or acc_auth_cred=='N/A':
                pi = "is_not_pi"
            else:
                pi = "is_pi"

            # check if the user has creds or not
            if acc_user_cred == {} or acc_user_cred == 'N/A':
                user_cred = 'no_creds'
            else:
                user_cred = 'has_creds'
           

            env['pi'] = pi
            env['user_cred'] = user_cred                
            env['person'] = self.request.user
        else: 
            env['person'] = None

        env['theme'] = self.theme
        env['section'] = "Dashboard"


        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        
#         account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
#         account_details = execute_query(self.request, account_query)
#         for account_detail in account_details:
#             account_config = json.loads(account_detail['config'])
#             platform_name = platform_detail['platform']
#             if 'myslice' in platform_detail['platform']:
#                 acc_user_cred = account_config.get('delegated_user_credential','N/A')
#                 acc_slice_cred = account_config.get('delegated_slice_credentials','N/A')
#                 acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
# 
#                 if 'N/A' not in acc_user_cred:
#                     exp_date = re.search('<expires>(.*)</expires>', acc_user_cred)
#                     if exp_date:
#                         user_exp_date = exp_date.group(1)
#                         user_cred_exp_list.append(user_exp_date)
# 
#                     my_users = [{'cred_exp': t[0]}
#                         for t in zip(user_cred_exp_list)]
#                
# 
#                 if 'N/A' not in acc_slice_cred:
#                     for key, value in acc_slice_cred.iteritems():
#                         slice_list.append(key)
#                         # get cred_exp date
#                         exp_date = re.search('<expires>(.*)</expires>', value)
#                         if exp_date:
#                             exp_date = exp_date.group(1)
#                             slice_cred_exp_list.append(exp_date)
# 
#                     my_slices = [{'slice_name': t[0], 'cred_exp': t[1]}
#                         for t in zip(slice_list, slice_cred_exp_list)]
# 
#                 if 'N/A' not in acc_auth_cred:
#                     for key, value in acc_auth_cred.iteritems():
#                         auth_list.append(key)
#                         #get cred_exp date
#                         exp_date = re.search('<expires>(.*)</expires>', value)
#                         if exp_date:
#                             exp_date = exp_date.group(1)
#                             auth_cred_exp_list.append(exp_date)

        
        return render_to_response(self.template, env, context_instance=RequestContext(request))

