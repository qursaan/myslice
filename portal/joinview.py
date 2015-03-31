import os.path, re
import json
from random import randint

from hashlib                    import md5
from django.core.mail           import EmailMultiAlternatives
from django.contrib.auth.models import User
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

from portal.models              import PendingUser,PendingAuthority
from portal.actions             import authority_get_pi_emails, manifold_add_user,manifold_add_account, create_pending_user

from myslice.theme import ThemeView
from myslice.settings import logger

import activity.institution

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
        page.add_js_files  ( [ "js/jquery.validate.js", "js/join.js", "js/jquery.qtip.min.js" ] )
        page.add_css_files ( [ "css/onelab.css", "css/registration.css", "css/jquery.qtip.min.css" ] )
        page.add_css_files ( [ "https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )

        if method == 'POST':
            # xxx tocheck - if authorities is empty, it's no use anyway
            # (users won't be able to validate the form anyway)
    
            # List local users in Manifold DB in order ot avoid duplicates
            user_query  = Query().get('local:user').select('user_id','email')
            list_users = execute_admin_query(self.request, user_query)
   
            reg_root_authority_hrn = request.POST.get('root_authority_hrn', '').lower()

            reg_site_name = request.POST.get('site_name', '')
            reg_site_authority = request.POST.get('site_authority', '').lower()
            reg_site_abbreviated_name = request.POST.get('site_abbreviated_name', '').lower()
            reg_site_url = request.POST.get('site_url', '')
            reg_site_latitude = request.POST.get('site_latitude', '')
            reg_site_longitude = request.POST.get('site_longitude', '')

            reg_fname  = request.POST.get('pi_first_name', '')
            reg_lname  = request.POST.get('pi_last_name', '')
            reg_auth   = 'onelab.' + reg_site_abbreviated_name   
            reg_email  = request.POST.get('pi_email','').lower()
            reg_phone  = request.POST.get('pi_phone','')
            #prepare user_hrn 
            split_email = reg_email.split("@")[0] 
            split_email = split_email.replace(".", "_")
            # Replace + by _ => more convenient for testing and validate with a real email
            split_email = split_email.replace("+", "_")
            user_hrn = reg_auth + '.' + split_email
            
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
            if (re.search(r'^[A-Za-z0-9_ ]*$', reg_site_name) == None):
                errors.append('Name of organization  may contain only letters, numbers, and underscore.')
            if (re.search(r'^[A-Za-z ]*$', reg_address_city) == None):
                errors.append('City may contain only letters.')
            if (re.search(r'^[A-Za-z ]*$', reg_address_country) == None):
                errors.append('Country may contain only letters.')
            if (re.search(r'^[A-Za-z0-9]*$', reg_site_abbreviated_name) == None):
                errors.append('Shortname  may contain only letters and numbers')
            if (re.search(r'^[0-9]*$', reg_phone) == None):
                errors.append('Phone number may contain only numbers.')
            #if (re.search(r'^\w+$', reg_site_authority) == None):
            #    errors.append('Site Authority may contain only letters or numbers.')
            # checking in django_db !!
            if PendingUser.objects.filter(email__iexact=reg_email):
                errors.append('Email is pending for validation. Please provide a new email address.')
            if PendingAuthority.objects.filter(site_abbreviated_name__iexact=reg_site_abbreviated_name):
                errors.append('This site is pending for validation.')
            #if PendingAuthority.objects.filter(site_name__iexact=reg_site_name):
            #    errors.append('This site is pending for validation.')

            if UserModel._default_manager.filter(email__iexact=reg_email): 
                errors.append('This email is not usable. Please contact the administrator or try with another email.')
            for user_detail in list_users:
                if user_detail['email']==reg_email:
                    errors.append('Email already registered in Manifold. Please provide a new email address.')

# XXX TODO: Factorize with portal/accountview.py
# XXX TODO: Factorize with portal/registrationview.py
# XXX TODO: Factorize with portal/joinview.py
#            if 'generate' in request.POST['question']:
            from Crypto.PublicKey import RSA
            private = RSA.generate(1024)
            private_key = private.exportKey()
            public_key = private.publickey().exportKey(format='OpenSSH')
            # Saving to DB
            auth_type = 'managed'

            if not errors:
                reg_password = request.POST['pi_password']
                a = PendingAuthority(
                    site_name             = reg_site_name,             
                    site_authority        = reg_auth, 
                    site_abbreviated_name = reg_site_abbreviated_name, 
                    site_url              = reg_site_url,
                    site_latitude         = reg_site_latitude, 
                    site_longitude        = reg_site_longitude,
                    address_line1         = reg_email, # XXX field name must be renamed. Email needed 4 rejection email.
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
                salt = randint(1,100000)
                # get the domain url
                current_site = Site.objects.get_current()
                current_site = current_site.domain

                email_hash = md5(str(salt)+reg_email).hexdigest()
                user_request = {
                    'first_name'    : reg_fname,
                    'last_name'     : reg_lname,
                    'organization'  : reg_site_name,
                    'authority_hrn' : reg_auth,
                    'email'         : reg_email,
                    'password'      : reg_password,
                    'public_key'    : public_key,
                    'private_key'   : private_key,
                    'current_site'  : current_site,
                    'email_hash'    : email_hash,
                    'user_hrn'      : user_hrn,
                    'pi'            : [reg_auth],
                    'auth_type'     : 'managed',
                    'validation_link': current_site + '/portal/email_activation/'+ email_hash
                }

                
                create_pending_user(request, user_request, user_detail)
                # saves the user to django auth_user table [needed for password reset]
                #user = User.objects.create_user(reg_email, reg_email, reg_password)

                #creating user to manifold local:user
                #user_config = '{"first_name":"'+ reg_fname + '", "last_name":"'+ reg_lname + '", "authority_hrn":"'+ reg_auth + '"}'
                #user_params = {'email': reg_email, 'password': reg_password, 'config': user_config, 'status': 1}
                #manifold_add_user(request,user_params)
                #creating local:account in manifold
                #user_id = user_detail['user_id']+1 # the user_id for the newly created user in local:user
                #account_params = {'platform_id': 5, 'user_id': user_id, 'auth_type': auth_type, 'config': account_config}
                #manifold_add_account(request,account_params)

                # Send email
                try: 
                    ctx = {
                        'site_name'             : reg_site_name,             
                        'authority_hrn'         : reg_root_authority_hrn + '.' + reg_site_authority,
                        'site_abbreviated_name' : reg_site_abbreviated_name, 
                        'site_url'              : reg_site_url,
                        'address_city'          : reg_address_city,
                        'address_country'       : reg_address_country,
                        'first_name'            : reg_fname, 
                        'last_name'             : reg_lname, 
                        'authority_hrn'         : reg_auth,
                        'email'                 : reg_email,
                        'user_hrn'              : user_hrn,
                        'public_key'            : public_key,
                        }

                    #recipients = authority_get_pi_emails(request,reg_auth)
                    
                    self.template_name = 'authority_request_email.html'
                    html_content = render_to_string(self.template, ctx)
            
                    self.template_name = 'authority_request_email.txt'
                    text_content = render_to_string(self.template, ctx)
            
                    self.template_name = 'authority_request_email_subject.txt'
                    subject = render_to_string(self.template, ctx)
                    subject = subject.replace('\n', '')
            
                    #theme.template_name = 'email_default_sender.txt'
                    #sender =  render_to_string(theme.template, ctx)
                    #sender = sender.replace('\n', '')
                    sender = reg_email
                    
                    msg = EmailMultiAlternatives(subject, text_content, sender, ['support@onelab.eu'])
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()
    
                except Exception, e:
                    logger.error("Failed to send email, please check the mail templates and the SMTP configuration of your server")
                    import traceback
                    logger.error(traceback.format_exc())

                self.template_name = 'join_complete.html'
                # log institution activity
                activity.institution.joined(self.request)
                return render(request, self.template, {'theme': self.theme})
                #return render(request, 'user_register_complete.html') 

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
        # log institution activity
        activity.institution.join(self.request)
        return render(request, 'join_view.html',template_env)
