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

from manifoldapi.manifoldapi    import execute_admin_query
from manifold.core.query        import Query

from portal.models              import PendingUser,PendingAuthority
from portal.actions             import authority_get_pi_emails, manifold_add_user,manifold_add_account

from theme import ThemeView

# since we inherit from FreeAccessView we cannot redefine 'dispatch'
# so let's override 'get' and 'post' instead
#
class JoinView (FreeAccessView, ThemeView):

    def post (self, request):
        return self.get_or_post (request, 'POST')

    def get (self, request):
        return self.get_or_post (request, 'GET')

    def get_or_post  (self, request, method):
        errors = []
        # List authorities already in the Registry in order to avoid duplicates
        # Using cache manifold-tables to get the list of authorities faster
        authorities_query = Query.get('authority').select('name', 'authority_hrn')
        authorities = execute_admin_query(request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities)
        root_authorities = sorted([a for a in authorities if '.' not in a['authority_hrn']])

        page = Page(request)
        page.add_js_files  ( [ "js/jquery.validate.js", "js/join.js" ] )
        page.add_css_files ( [ "css/onelab.css", "css/registration.css" ] )
        page.add_css_files ( [ "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )

        if method == 'POST':
            # xxx tocheck - if authorities is empty, it's no use anyway
            # (users won't be able to validate the form anyway)
    
            # List local users in Manifold DB in order ot avoid duplicates
            user_query  = Query().get('local:user').select('user_id','email')
            list_users = execute_admin_query(self.request, user_query)
   
            reg_root_authority_hrn = request.POST.get('root_authority_hrn', '').lower()

            reg_site_name = request.POST.get('site_name', '')
            reg_site_authority = request.POST.get('site_authority', '').lower()
            reg_site_abbreviated_name = request.POST.get('site_abbreviated_name', '')
            reg_site_url = request.POST.get('site_url', '')
            reg_site_latitude = request.POST.get('site_latitude', '')
            reg_site_longitude = request.POST.get('site_longitude', '')

            reg_fname  = request.POST.get('pi_first_name', '')
            reg_lname  = request.POST.get('pi_last_name', '')
            reg_auth   = reg_root_authority_hrn + "." + reg_site_authority 
            reg_email  = request.POST.get('pi_email','').lower()
            reg_phone  = request.POST.get('pi_phone','')
            #prepare user_hrn 
            split_email = reg_email.split("@")[0] 
            split_email = split_email.replace(".", "_")
            user_hrn = reg_auth + '.' + split_email+ str(randint(1,1000000))
            
            UserModel = get_user_model()
            
            reg_address_line1 = request.POST.get('address_line1', '')
            reg_address_line2 = request.POST.get('address_line2', '')
            reg_address_line3 = request.POST.get('address_line3', '')
            reg_address_city = request.POST.get('address_city', '')
            reg_address_postalcode = request.POST.get('address_postalcode', '')
            reg_address_state = request.POST.get('address_state', '')
            reg_address_country = request.POST.get('address_country', '')

            #POST value validation  
            if (re.search(r'^[\w+\s.@+-]+$', reg_fname)==None):
                errors.append('First Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            if (re.search(r'^[\w+\s.@+-]+$', reg_lname) == None):
                errors.append('Last Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            if (re.search(r'^\w+$', reg_site_authority) == None):
                errors.append('Site Authority may contain only letters or numbers.')
            # checking in django_db !!
            if PendingUser.objects.filter(email__iexact=reg_email):
                errors.append('Email is pending for validation. Please provide a new email address.')
            if PendingAuthority.objects.filter(site_authority__iexact=reg_auth):
                errors.append('This site is pending for validation.')
            if PendingAuthority.objects.filter(site_name__iexact=reg_site_name):
                errors.append('This site is pending for validation.')

            if UserModel._default_manager.filter(email__iexact=reg_email): 
                errors.append('This email is not usable. Please contact the administrator or try with another email.')
            for user_detail in list_users:
                if user_detail['email']==reg_email:
                    errors.append('Email already registered in Manifold. Please provide a new email address.')

# XXX TODO: Factorize with portal/accountview.py
#            if 'generate' in request.POST['question']:
            from Crypto.PublicKey import RSA
            private = RSA.generate(1024)
            private_key = json.dumps(private.exportKey())
            public  = private.publickey()
            public_key = json.dumps(public.exportKey(format='OpenSSH'))

            # Saving to DB
            account_config = '{"user_public_key":'+ public_key + ', "user_private_key":'+ private_key + ', "user_hrn":"'+ user_hrn + '"}'
            auth_type = 'managed'
            public_key = public_key.replace('"', '');

            if not errors:
                reg_password = request.POST['pi_password']
                a = PendingAuthority(
                    site_name             = reg_site_name,             
                    site_authority        = reg_root_authority_hrn + '.' + reg_site_authority, 
                    site_abbreviated_name = reg_site_abbreviated_name, 
                    site_url              = reg_site_url,
                    site_latitude         = reg_site_latitude, 
                    site_longitude        = reg_site_longitude,
                    address_line1         = reg_address_line1,
                    address_line2         = reg_address_line2,
                    address_line3         = reg_address_line3,
                    address_city          = reg_address_city,
                    address_postalcode    = reg_address_postalcode,
                    address_state         = reg_address_state,
                    address_country       = reg_address_country,
                    authority_hrn         = reg_root_authority_hrn,
                )
                a.save()
 
                reg_password = request.POST['pi_password']
                b = PendingUser(
                    first_name    = reg_fname, 
                    last_name     = reg_lname, 
                    authority_hrn = reg_auth,
                    email         = reg_email, 
                    password      = reg_password,
                    keypair       = account_config,
                    pi            = reg_auth,
                )
                b.save()

                # saves the user to django auth_user table [needed for password reset]
                user = User.objects.create_user(reg_email, reg_email, reg_password)

                #creating user to manifold local:user
                user_config = '{"firstname":"'+ reg_fname + '", "lastname":"'+ reg_lname + '", "authority":"'+ reg_auth + '"}'
                user_params = {'email': reg_email, 'password': reg_password, 'config': user_config, 'status': 1}
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
                send_mail("Onelab New Authority request for %s submitted"%reg_email, msg, 'support@myslice.info', recipients)
                return render(request, 'user_register_complete.html') 

        template_env = {
          'topmenu_items': topmenu_items_live('join', page),
          'errors': errors,
          'pi_first_name': request.POST.get('pi_first_name', ''),
          'pi_last_name': request.POST.get('pi_last_name', ''),
          'pi_email': request.POST.get('pi_email', ''),
          'pi_phone': request.POST.get('pi_phone', ''),
          'pi_password': request.POST.get('pi_password', ''),           
          'site_name': request.POST.get('site_name', ''),
          'site_authority': request.POST.get('site_authority', '').lower(),
          'site_abbreviated_name': request.POST.get('site_abbreviated_name', ''),
          'site_url': request.POST.get('site_url', ''),
          'site_latitude': request.POST.get('site_latitude', ''),
          'site_longitude': request.POST.get('site_longitude', ''),
          'address_line1': request.POST.get('address_line1', ''),
          'address_line2': request.POST.get('address_line2', ''),
          'address_line3': request.POST.get('address_line3', ''),
          'address_city': request.POST.get('address_city', ''),
          'address_postalcode': request.POST.get('address_postalcode', ''),
          'address_state': request.POST.get('address_state', ''),
          'address_country': request.POST.get('address_country', ''),
          'root_authority_hrn': request.POST.get('root_authority_hrn', '').lower(),
          'root_authorities': root_authorities,
          'authorities': authorities,
          'theme': self.theme
          }
        template_env.update(page.prelude_env ())
        return render(request, 'join_view.html',template_env)
