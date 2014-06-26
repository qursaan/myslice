import os.path, re
import json
from random     import randint
from hashlib    import md5

from django.views.generic       import View
from django.template.loader     import render_to_string
from django.shortcuts           import render
from django.contrib.auth        import get_user_model
from django.contrib.sites.models import Site

from unfold.page                import Page
from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items_live

from manifoldapi.manifoldapi    import execute_admin_query
from manifold.core.query        import Query

from portal.models              import PendingUser
from portal.actions             import create_pending_user

from myslice.theme import ThemeView

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

        authorities_query = Query.get('authority').select('name', 'authority_hrn')
        authorities = execute_admin_query(wsgi_request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities)
        
        # Page rendering
        page = Page(wsgi_request)
        page.add_js_files  ( [ "js/jquery.validate.js", "js/my_account.register.js", "js/jquery.qtip.min.js" ] )
        page.add_css_files ( [ "css/onelab.css", "css/registration.css", "css/jquery.qtip.min.css" ] )
        page.add_css_files ( [ "https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )

        if method == 'POST':
            # The form has been submitted
            
            # get the domain url
            current_site = Site.objects.get_current()
            current_site = current_site.domain

            post_email = wsgi_request.POST.get('email','').lower()
            salt = randint(1,100000)
            email_hash = md5(str(salt)+post_email).hexdigest()
            #email_hash = md5(post_email).digest().encode('base64')[:-1]
            user_request = {
                'first_name'    : wsgi_request.POST.get('firstname',     ''),
                'last_name'     : wsgi_request.POST.get('lastname',      ''),
                'authority_hrn' : wsgi_request.POST.get('authority_hrn', ''),
                'email'         : post_email,
                'password'      : wsgi_request.POST.get('password',      ''),
                'current_site'  : current_site,
                'email_hash'    : email_hash,
                'validation_link': 'http://' + current_site + '/portal/email_activation/'+ email_hash
            }

            # Construct user_hrn from email (XXX Should use common code)
            split_email = user_request['email'].split("@")[0] 
            split_email = split_email.replace(".", "_")
            user_request['user_hrn'] = user_request['authority_hrn'] \
                     + '.' + split_email
            
            # Validate input
            UserModel = get_user_model()
            if (re.search(r'^[\w+\s.@+-]+$', user_request['first_name']) == None):
                errors.append('First Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            if (re.search(r'^[\w+\s.@+-]+$', user_request['last_name']) == None):
                errors.append('Last Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            # checking in django_db !!
            if PendingUser.objects.filter(email__iexact = user_request['email']):
                errors.append('Email is pending for validation. Please provide a new email address.')
            if UserModel._default_manager.filter(email__iexact = user_request['email']): 
                errors.append('This email is not usable. Please contact the administrator or try with another email.')
            # Does the user exist in Manifold?
            user_query  = Query().get('local:user').select('user_id','email')
            user_details = execute_admin_query(wsgi_request, user_query)
            for user_detail in user_details:
                if user_detail['email'] == user_request['email']:
                    errors.append('Email already registered in Manifold. Please provide a new email address.')
            # Does the user exist in sfa? [query is very slow!!]
            #user_query  = Query().get('user').select('user_hrn','user_email')
            # XXX Test based on the user_hrn is quick
            user_query  = Query().get('user').select('user_hrn','user_email').filter_by('user_hrn','==',user_request['user_hrn'])
            user_details_sfa = execute_admin_query(wsgi_request, user_query)

            for user in user_details_sfa:
                if user['user_email'] == user_request['email']:
                    errors.append('Email already registered in SFA registry. Please use another email.')
                if user['user_hrn'] == user_request['user_hrn']:
                    # add random number if user_hrn already exists in the registry
                    user_request['user_hrn'] = user_request['authority_hrn'] \
                            + '.' + split_email + str(randint(1,1000000))
                
            # XXX TODO: Factorize with portal/accountview.py
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

                user_request['private_key'] = None
                user_request['public_key']  = file_content
                
            if not errors:
                create_pending_user(wsgi_request, user_request, user_detail)
                self.template_name = 'user_register_complete.html'
                return render(wsgi_request, self.template, {'theme': self.theme}) 

        else:
            user_request = {}

        template_env = {
          'topmenu_items': topmenu_items_live('Register', page),
          'errors': errors,
          'authorities': authorities,
          'theme': self.theme
          }
        template_env.update(user_request)
        template_env.update(page.prelude_env ())
        return render(wsgi_request, self.template,template_env)
