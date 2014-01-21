import os.path, re
import json
from random import randint

from django.core.mail           import send_mail
from django.contrib.auth.models import User
from django.views.generic       import View
from django.template.loader     import render_to_string
from django.shortcuts           import render
from django.contrib.auth        import get_user_model

from unfold.page                import Page
from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items_live

from manifold.manifoldapi       import execute_admin_query
from manifold.core.query        import Query

from portal.models              import PendingUser
from portal.actions             import authority_get_pi_emails, manifold_add_user,manifold_add_account

# since we inherit from FreeAccessView we cannot redefine 'dispatch'
# so let's override 'get' and 'post' instead
#
class RegistrationView (FreeAccessView):

    def post (self, request):
        return self.get_or_post (request, 'POST')

    def get (self, request):
        return self.get_or_post (request, 'GET')

    def get_or_post  (self, request, method):
        errors = []

        # Using cache manifold-tables to get the list of authorities faster
        authorities_query = Query.get('authority').select('name', 'authority_hrn')
        
        #onelab_enabled_query = Query.get('local:platform').filter_by('platform', '==', 'ple').filter_by('disabled', '==', 'False')
        #onelab_enabled = not not execute_admin_query(request, onelab_enabled_query)
        #if onelab_enabled:
        if True:
            print "ONELAB ENABLED"
            #authorities_query = Query.get('ple:authority').select('name', 'authority_hrn').filter_by('authority_hrn', 'included', ['ple.inria', 'ple.upmc', 'ple.ibbtple', 'ple.nitos'])
            # Now using Cache 
        else:
            print "FIREXP ENABLED"

        authorities = execute_admin_query(request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities)
        # xxx tocheck - if authorities is empty, it's no use anyway
        # (users won't be able to validate the form anyway)

        page = Page(request)
        page.add_js_files  ( [ "js/jquery.validate.js", "js/my_account.register.js" ] )
        page.add_css_files ( [ "css/onelab.css", "css/registration.css" ] )
        page.add_css_files ( [ "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )

        print 'registration view, method',method

        user_query  = Query().get('local:user').select('user_id','email')
        user_details = execute_admin_query(self.request, user_query)

        if method == 'POST':
            # We shall use a form here

            #get_email = PendingUser.objects.get(email)
            reg_fname  = request.POST.get('firstname', '')
            reg_lname  = request.POST.get('lastname', '')
            #reg_aff   = request.POST.get('affiliation','')
            reg_auth   = request.POST.get('authority_hrn', '')
            #reg_login  = request.POST.get('login', '')
            reg_email  = request.POST.get('email','').lower()
            #prepare user_hrn 
            split_email = reg_email.split("@")[0] 
            split_email = split_email.replace(".", "_")
            user_hrn = reg_auth + '.' + split_email+ str(randint(1,1000000))
            
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
                    errors.append('Please upload a valid RSA public key [.txt or .pub].')

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
                )
                b.save()
                # saves the user to django auth_user table [needed for password reset]
                user = User.objects.create_user(reg_email, reg_email, request.POST['password'])
                #creating user to manifold local:user
                user_config = '{"firstname":"'+ reg_fname + '", "lastname":"'+ reg_lname + '", "authority":"'+ reg_auth + '"}'
                user_params = {'email': reg_email, 'password': request.POST['password'], 'config': user_config}
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
                
                # We don't need to send this email to user.
                # it's for the PI only
                #if ctx['cc_myself']:
                #    recipients.append(ctx['email'])

                msg = render_to_string('user_request_email.txt', ctx)
                send_mail("Onelab New User request for %s submitted"%reg_email, msg, 'support@myslice.info', recipients)
                return render(request, 'user_register_complete.html') 

        template_env = {
          'topmenu_items': topmenu_items_live('Register', page),
          'errors': errors,
          'firstname': request.POST.get('firstname', ''),
          'lastname': request.POST.get('lastname', ''),
          #'affiliation': request.POST.get('affiliation', ''),
          'authority_hrn': request.POST.get('authority_hrn', ''),
          'email': request.POST.get('email', ''),
          'password': request.POST.get('password', ''),           
          'authorities': authorities,
          }
        template_env.update(page.prelude_env ())
        return render(request, 'registration_view.html',template_env)
