import os.path, re
import json

from django.core.mail           import send_mail

from django.views.generic       import View
from django.template.loader     import render_to_string
from django.shortcuts           import render

from unfold.page                import Page
from ui.topmenu                 import topmenu_items

from manifold.manifoldapi       import execute_admin_query
from manifold.core.query        import Query

from portal.models              import PendingUser
from portal.actions             import authority_get_pi_emails 

# This is a rough porting from views.py
# the former function-based view is now made a class
# we redefine dispatch as it is simple
# and coincidentally works since we do not need LoginRequiredAutoLogoutView
# a second stab should redefine post and get instead
# also this was not thoroughly tested either, might miss some imports
# to be continued...

class RegistrationView (View):

    def dispatch (self, request):
        errors = []

        authorities_query = Query.get('authority').\
            select('name', 'authority_hrn')
        
        onelab_enabled_query = Query.get('local:platform').filter_by('platform', '==', 'ple').filter_by('disabled', '==', 'False')
        onelab_enabled = not not execute_admin_query(request, onelab_enabled_query)
        if onelab_enabled:
            print "ONELAB ENABLED"
            authorities_query = authorities_query.filter_by('authority_hrn', 'included', ['ple.inria', 'ple.upmc', 'ple.ibbtple'])
        else:
            print "FIREXP ENABLED"

        authorities = execute_admin_query(request, authorities_query)
        # xxx tocheck - if authorities is empty, it's no use anyway
        # (users won't be able to validate the form anyway)

        page = Page(request)
        page.add_js_files  ( [ "js/jquery.validate.js", "js/my_account.register.js" ] )
        page.add_css_files ( [ "css/onelab.css", "css/registration.css" ] )

        print 'registration view, method',request.method

        if request.method == 'POST':
            # We shall use a form here

            #get_email = PendingUser.objects.get(email)
            reg_fname  = request.POST.get('firstname', '')
            reg_lname  = request.POST.get('lastname', '')
            #reg_aff   = request.POST.get('affiliation','')
            reg_auth   = request.POST.get('authority_hrn', '')
            reg_login  = request.POST.get('login', '')
            reg_email  = request.POST.get('email','').lower()
      
            #POST value validation  
            if (re.search(r'^[\w+\s.@+-]+$', reg_fname)==None):
                errors.append('First Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            if (re.search(r'^[\w+\s.@+-]+$', reg_lname) == None):
                errors.append('Last Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            # XXX validate authority hrn !!
            if PendingUser.objects.filter(email__iexact=reg_email):
                errors.append('Email already registered.Please provide a new email address.')

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
                keypair = '{"user_public_key":'+ public_key + ', "user_private_key":'+ private_key + '}'
                #keypair = re.sub("\r", "", keypair)
                #keypair = re.sub("\n", "\\n", keypair)
                #keypair = keypair.rstrip('\r\n')
                #keypair = ''.join(keypair.split())
            else: 
                up_file = request.FILES['user_public_key']
                file_content =  up_file.read()
                file_name = up_file.name
                file_extension = os.path.splitext(file_name)[1]
                allowed_extension =  ['.pub','.txt']
                if file_extension in allowed_extension and re.search(r'ssh-rsa',file_content):
                    keypair = '{"user_public_key":"'+ file_content +'"}'
                    keypair = re.sub("\r", "", keypair)
                    keypair = re.sub("\n", "\\n",keypair)
                    keypair = ''.join(keypair.split())
                    # for sending email
                    public_key = file_content
                else:
                    errors.append('Please upload a valid RSA public key [.txt or .pub].')

            #b = PendingUser(first_name=reg_fname, last_name=reg_lname, affiliation=reg_aff, 
            #                email=reg_email, password=request.POST['password'], keypair=keypair)
            #b.save()
            if not errors:
                b = PendingUser(
                    first_name    = reg_fname, 
                    last_name     = reg_lname, 
                    #affiliation  = reg_aff,
                    authority_hrn = reg_auth,
                    login         = reg_login,
                    email         = reg_email, 
                    password      = request.POST['password'],
                    keypair       = keypair,
                )
                b.save()

                # Send email
                ctx = {
                    'first_name'    : reg_fname, 
                    'last_name'     : reg_lname, 
                    'authority_hrn' : reg_auth,
                    'email'         : reg_email, 
                    'keypair'       : 'Public Key :' + public_key,
                    'cc_myself'     : True # form.cleaned_data['cc_myself']
                    }

                recipients = authority_get_pi_emails(request,reg_auth)

                if ctx['cc_myself']:
                    recipients.append(ctx['email'])

                msg = render_to_string('user_request_email.txt', ctx)
                send_mail("Onelab New User request for %s submitted"%reg_email, msg, reg_email, recipients)

                return render(request, 'user_register_complete.html')

        template_env = {
          'topmenu_items': topmenu_items('Register', request),
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
