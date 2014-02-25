from django.template.loader      import render_to_string
from django.shortcuts            import render
from django.core.mail            import send_mail

from unfold.page                import Page

from manifold.core.query         import Query
from manifold.manifoldapi        import execute_admin_query, execute_query

from portal.models               import PendingSlice
from portal.actions              import authority_get_pi_emails
from portal.forms                import SliceRequestForm
from unfold.loginrequired        import LoginRequiredAutoLogoutView
from ui.topmenu                  import topmenu_items_live, the_user

from theme import ThemeView

import json

class SliceRequestView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'slicerequest_view.html'
    
    def __init__ (self):
        self.user_email = ''
        self.errors = []

    # because we inherit LoginRequiredAutoLogoutView that is implemented by redefining 'dispatch'
    # we cannot redefine dispatch here, or we'd lose LoginRequired and AutoLogout behaviours
    def post (self, request):
        return self.get_or_post (request, 'POST')

    def get (self, request):
        return self.get_or_post (request, 'GET')

    def get_or_post  (self, request, method):
        # Using cache manifold-tables to get the list of authorities faster
        authorities_query = Query.get('authority').select('name', 'authority_hrn')
        authorities = execute_admin_query(request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities)

        user_query  = Query().get('local:user').select('email')
        user_email = execute_query(self.request, user_query)
        self.user_email = user_email[0].get('email')


        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        account_details = execute_query(self.request, account_query)

        platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
        platform_details = execute_query(self.request, platform_query)
        user_hrn = None
        # getting user_hrn from local:account
        for account_detail in account_details:
            for platform_detail in platform_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    # taking user_hrn only from myslice account
                    # NOTE: we should later handle accounts filter_by auth_type= managed OR user
                    if 'myslice' in platform_detail['platform']:
                        account_config = json.loads(account_detail['config'])
                        user_hrn = account_config.get('user_hrn','N/A')


        #user_query  = Query().get('user').select('user_hrn').filter_by('user_hrn','==','$user_hrn')
        #user_hrn = execute_query(self.request, user_query)
        #self.user_hrn = user_hrn[0].get('user_hrn')
        
        
        page = Page(request)
        page.add_css_files ( [ "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )

        if method == 'POST':
            self.errors = []
    
            # The form has been submitted
            slice_name = request.POST.get('slice_name', '')
            authority_hrn = request.POST.get('authority_hrn', '')
            number_of_nodes = request.POST.get('number_of_nodes', '')
            purpose = request.POST.get('purpose', '')
            email = self.user_email
            cc_myself = True
            
            if (authority_hrn is None or authority_hrn == ''):
                self.errors.append('Please, select an authority')
            # What kind of slice name is valid?
            if (slice_name is None or slice_name == ''):
                self.errors.append('Slice Name is mandatory')
    
            if (purpose is None or purpose == ''):
                self.errors.append('Purpose is mandatory')
    
            if not self.errors:
                ctx = {
                    'email': email,
                    'slice_name': slice_name,
                    'authority_hrn': authority_hrn,
                    'number_of_nodes': number_of_nodes,
                    'purpose': purpose,
                }            
                s = PendingSlice(
                    slice_name      = slice_name,
                    user_hrn        = user_hrn,
                    authority_hrn   = authority_hrn,
                    number_of_nodes = number_of_nodes,
                    purpose         = purpose
                )
                s.save()
    
                # The recipients are the PI of the authority
                recipients = authority_get_pi_emails(request, authority_hrn)
    
                if cc_myself:
                    recipients.append(email)
                msg = render_to_string('slice-request-email.txt', ctx)
                #print "email, msg, email, recipients", email , msg, email, recipients 
                send_mail("Onelab user %s requested a slice"%email , msg, email, recipients)
                
                self.template_name = 'slice-request-ack-view.html'
                
                return render(request, self.template, {'theme': self.theme}) # Redirect after POST
        template_env = {
            'username': request.user.email,
          'topmenu_items': topmenu_items_live('Request a slice', page),
          'errors': self.errors,
          'slice_name': request.POST.get('slice_name', ''),
          'authority_hrn': request.POST.get('authority_hrn', ''),
          'number_of_nodes': request.POST.get('number_of_nodes', ''),
          'purpose': request.POST.get('purpose', ''),
          'email': self.user_email,
          'user_hrn': user_hrn,
          'cc_myself': True,
          'authorities': authorities,
          'theme': self.theme
        }
        template_env.update(page.prelude_env ())
        return render(request, self.template, template_env)
