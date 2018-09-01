import os.path
import re
import json
from random     import randint
from hashlib    import md5

from django.views.generic       import View
from django.template.loader     import render_to_string

from django.shortcuts           import render
from django.contrib.auth        import get_user_model

from unfold.page                import Page
from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items_live

from manifoldapi.manifoldapi    import execute_admin_query
from manifold.core.query        import Query

from portal.models              import PendingUser
from portal.actions             import create_pending_user, getAuthorities

from myslice.theme import ThemeView
from myslice.settings import logger

import activity.user

# since we inherit from FreeAccessView we cannot redefine 'dispatch'
# so let's override 'get' and 'post' instead
#
class RegistrationView (FreeAccessView, ThemeView):
    template_name = 'registration_view.html'
    
    def post (self, request):
        return self.get_or_post (request, 'POST')

    def get (self, request):
        return self.get_or_post (request, 'GET')

    def get_or_post(self, wsgi_request, method):
        """
        """
        errors = []

        authorities = getAuthorities(wsgi_request, admin = True)

        #authority_hrn = None
        ## REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
        #authorities_query = Query.get('authority').select('name', 'authority_hrn')
        #authorities = execute_admin_query(wsgi_request, authorities_query)
        #if authorities is not None:
        #    # Remove the root authority from the list
        #    matching = [s for s in authorities if "." in s['authority_hrn']]
        #    authorities = sorted(matching, key=lambda k: k['authority_hrn'])
        #    authorities = sorted(matching, key=lambda k: k['name'])
        
        logger.debug("############ BREAKPOINT 1 #################")
        # Page rendering
        page = Page(wsgi_request)

        page.add_css_files ( [ "https://code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css" ] )

        page.add_js_files  ( [ "js/jquery.validate.js", "js/my_account.register.js", "js/jquery.qtip.min.js","js/jquery-ui.js","js/jquery-ui-combobox.js" ] )

        page.add_css_files ( [ "css/onelab.css", "css/registration.css", "css/jquery.qtip.min.css", "css/jquery.ui.combobox.css" ] )
        page.expose_js_metadata()
        logger.debug("############ BREAKPOINT 2 #################")
        if method == 'POST':
            reg_form = {}
            # The form has been submitted
            
<<<<<<< HEAD
            UserModel = get_user_model()

            #POST value validation  
            if (re.search(r'^[\w+\s.@+-]+$', reg_fname)==None):
                errors.append('First Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            if (re.search(r'^[\w+\s.@+-]+$', reg_lname) == None):
                errors.append('Last Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            # checking in django_db !!
            if PendingUser.objects.filter(email__iexact=reg_email):
                errors.append('Email is pending for validation. Please provide a new email address.')
            if UserModel._default_manager.filter(email__iexact=reg_email): 
                errors.append('This email is not usable. Please contact the administrator or try with another email.')
            for user_detail in user_details:
                if user_detail['email']==reg_email:
                    errors.append('Email already registered in Manifold. Please provide a new email address.')

# XXX TODO: Factorize with portal/accountview.py
            if 'generate' in request.POST['question']:
                from Crypto.PublicKey import RSA
                private = RSA.generate(1024)
                private_key = json.dumps(private.exportKey())
                public  = private.publickey()
                public_key = json.dumps(public.exportKey(format='OpenSSH'))

#                # Generate public and private keys using SFA Library
#                from sfa.trust.certificate  import Keypair
#                k = Keypair(create=True)
#                public_key = k.get_pubkey_string()
#                private_key = k.as_pem()
#                private_key = ''.join(private_key.split())
#                public_key = "ssh-rsa " + public_key
                # Saving to DB
                account_config = '{"user_public_key":'+ public_key + ', "user_private_key":'+ private_key + ', "user_hrn":"'+ user_hrn + '"}'
                auth_type = 'managed'
                #keypair = re.sub("\r", "", keypair)
                #keypair = re.sub("\n", "\\n", keypair)
                #keypair = keypair.rstrip('\r\n')
                #keypair = ''.join(keypair.split())
                #for sending email: removing existing double qoute 
                public_key = public_key.replace('"', '');
            else: 
                up_file = request.FILES['user_public_key']
                file_content =  up_file.read()
                file_name = up_file.name
                file_extension = os.path.splitext(file_name)[1]
                allowed_extension =  ['.pub','.txt']
                if file_extension in allowed_extension and re.search(r'ssh-rsa',file_content):
                    account_config = '{"user_public_key":"'+ file_content + '", "user_hrn":"'+ user_hrn +'"}'
                    account_config = re.sub("\r", "", account_config)
                    account_config = re.sub("\n", "\\n",account_config)
                    account_config = ''.join(account_config.split())
                    auth_type = 'user'
                    # for sending email
                    public_key = file_content
                    public_key = ''.join(public_key.split()) 
                else:
                    errors.append('Please upload a valid RSA public key.')

            #b = PendingUser(first_name=reg_fname, last_name=reg_lname, affiliation=reg_aff, 
            #                email=reg_email, password=request.POST['password'], keypair=keypair)
            #b.save()
            #saving to django db 'portal_pendinguser' table
            if not errors:
                b = PendingUser(
                    first_name    = reg_fname, 
                    last_name     = reg_lname, 
                    #affiliation  = reg_aff,
                    authority_hrn = reg_auth,
                    #login         = reg_login,
                    email         = reg_email, 
                    password      = request.POST['password'],
                    keypair       = account_config,
                    pi            = '',
                )
                b.save()
                # saves the user to django auth_user table [needed for password reset]
                user = User.objects.create_user(reg_email, reg_email, request.POST['password'])
                #creating user to manifold local:user
                user_config = '{"firstname":"'+ reg_fname + '", "lastname":"'+ reg_lname + '", "authority":"'+ reg_auth + '"}'
                user_params = {'email': reg_email, 'password': request.POST['password'], 'config': user_config, 'status': 1}
                manifold_add_user(request,user_params)
                #creating local:account in manifold
                user_id = user_detail['user_id']+1 # the user_id for the newly created user in local:user
                account_params = {'platform_id': 5, 'user_id': user_id, 'auth_type': auth_type, 'config': account_config}
                manifold_add_account(request,account_params)
 
                # Send email
                ctx = {
                    'first_name'    : reg_fname, 
                    'last_name'     : reg_lname, 
                    'authority_hrn' : reg_auth,
                    'email'         : reg_email,
                    'user_hrn'      : user_hrn,
                    'public_key'    : public_key,
                    }
                recipients = authority_get_pi_emails(request,reg_auth)
                # backup email: if authority_get_pi_emails fails
                recipients.append('support@myslice.info')
                
                msg = render_to_string('user_request_email.txt', ctx)
                send_mail("Onelab New User request for %s submitted"%reg_email, msg, 'support@myslice.info', recipients)
                return render(request, 'user_register_complete.html') 
=======
            if wsgi_request.is_secure():
                current_site = 'https://'
            else:
                current_site = 'http://'
            current_site += wsgi_request.META['HTTP_HOST']

            logger.debug("############ BREAKPOINT 3 #################")
            post_email = wsgi_request.POST.get('email','').lower()
            salt = randint(1,100000)
            email_hash = md5(str(salt)+post_email).hexdigest()
            #email_hash = md5(post_email).digest().encode('base64')[:-1]
            user_request = {
                'first_name'    : wsgi_request.POST.get('firstname',     ''),
                'last_name'     : wsgi_request.POST.get('lastname',      ''),
                'authority_hrn' : wsgi_request.POST.get('org_name', ''), 
                'email'         : post_email,
                'password'      : wsgi_request.POST.get('password',      ''),
                'current_site'  : current_site,
                'email_hash'    : email_hash,
                'pi'            : '',
                'validation_link': current_site + '/portal/email_activation/'+ email_hash
            }

            logger.debug("############ BREAKPOINT 4 #################")
            auth = wsgi_request.POST.get('org_name', None)
            if auth is None or auth == "":
                errors.append('Organization required: please select one or request its addition')
            else:
               
                logger.debug("############ BREAKPOINT 5 #################")
                
                # Construct user_hrn from email (XXX Should use common code)
                split_email = user_request['email'].split("@")[0] 
                split_email = split_email.replace(".", "_")
                # Replace + by _ => more convenient for testing and validate with a real email
                split_email = split_email.replace("+", "_")
                user_request['user_hrn'] = user_request['authority_hrn'] \
                         + '.' + split_email
                
                # Validate input
                UserModel = get_user_model()
                if (re.search(r'^[\w+\s.@+-]+$', user_request['first_name']) == None):
                    errors.append('First name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
                if (re.search(r'^[\w+\s.@+-]+$', user_request['last_name']) == None):
                    errors.append('Last name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
                # Does the user exist in Manifold?
                user_query  = Query().get('local:user').select('user_id','email')
                user_details = execute_admin_query(wsgi_request, user_query)
                for user_detail in user_details:
                    if user_detail['email'] == user_request['email']:
                        errors.append('Email already registered. <a href="/">Login</a> with your existing account. <a href="/portal/pass_reset/">Forgot your password?</a>')

                # Does the user exist in sfa? [query is very slow!!]
                #user_query  = Query().get('user').select('user_hrn','user_email')
                # XXX Test based on the user_hrn is quick

                # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
                user_query  = Query().get('myslice:user').select('user_hrn','user_email').filter_by('user_hrn','==',user_request['user_hrn'])
                user_details_sfa = execute_admin_query(wsgi_request, user_query)

                for user in user_details_sfa:
                    if user['user_email'] == user_request['email']:
                        errors.append('Email already registered in OneLab registry. <a href="/contact">Contact OneLab support</a> or use another email.')
                    if user['user_hrn'] == user_request['user_hrn']:
                        # add random number if user_hrn already exists in the registry
                        user_request['user_hrn'] = user_request['authority_hrn'] \
                                + '.' + split_email + str(randint(1,1000000))

                # checking in django unfold db portal application pending users
                # sqlite3 /var/unfold/unfold.sqlite3
                # select email from portal_pendinguser;
                if PendingUser.objects.filter(email__iexact = user_request['email']):
                    errors.append('Account pending for validation. Please wait till your account is validated or contact OneLab support.')

                # checking in django_db !!
                # sqlite3 /var/unfold/unfold.sqlite3
                # select email from auth_user;
                if UserModel._default_manager.filter(email__iexact = user_request['email']): 
                    errors.append('<a href="/contact">Contact support</a> or try with another email.')

                # XXX TODO: Factorize with portal/accountview.py
                # XXX TODO: Factorize with portal/registrationview.py
                # XXX TODO: Factorize with portal/joinview.py
                if 'generate' in wsgi_request.POST['question']:
                    user_request['auth_type'] = 'managed'

                    # XXX Common code, dependency ?
                    from Crypto.PublicKey import RSA
                    private = RSA.generate(1024)

                    # Example: private_key = '-----BEGIN RSA PRIVATE KEY-----\nMIIC...'
                    # Example: public_key = 'ssh-rsa AAAAB3...'
                    user_request['private_key'] = private.exportKey()
                    user_request['public_key']  = private.publickey().exportKey(format='OpenSSH')

                else: 
                    user_request['auth_type'] = 'user'

                    up_file        = wsgi_request.FILES['user_public_key']

                    file_content   = up_file.read().strip()
                    file_name      = up_file.name
                    file_extension = os.path.splitext(file_name)[1]

                    ALLOWED_EXTENSIONS =  ['.pub','.txt']
                    if file_extension not in ALLOWED_EXTENSIONS or not re.search(r'ssh-rsa',file_content):
                        errors.append('Please upload a valid RSA public key.')
                    # user_request['private_key'] can't be Null because all db fields are set as NOT NULL
                    user_request['private_key'] = ""
                    user_request['public_key']  = file_content
                    
                if not errors:
                    create_pending_user(wsgi_request, user_request, user_detail)
                    self.template_name = 'user_register_complete.html'
                    # log user activity
                    activity.user.registered(self.request)
                    return render(wsgi_request, self.template, {'theme': self.theme}) 

        else:
            logger.debug("############ BREAKPOINT A #################")
            user_request = {}
            ## this is coming from onelab website onelab.eu
            reg_form = {
                'first_name':  wsgi_request.GET.get('first_name', ''),
                'last_name': wsgi_request.GET.get('last_name', ''),
                'email': wsgi_request.GET.get('email', ''),
                }
            # log user activity
            activity.user.signup(self.request)
            logger.debug("############ BREAKPOINT B #################")
>>>>>>> onelab

        template_env = {
          #'topmenu_items': topmenu_items_live('Register', page),
          'errors': errors,
          'authorities': authorities,
          'theme': self.theme
          }
        template_env.update(user_request)
        template_env.update(reg_form)
        template_env.update(page.prelude_env ())
        logger.debug("############ BREAKPOINT C #################")
        return render(wsgi_request, self.template,template_env)
