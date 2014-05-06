from django.shortcuts           import render
from django.contrib.sites.models import Site


from unfold.page                import Page

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_admin_query, execute_query

from portal.actions             import is_pi, create_slice, create_pending_slice
from portal.forms               import SliceRequestForm
from unfold.loginrequired       import LoginRequiredAutoLogoutView
from ui.topmenu                 import topmenu_items_live, the_user

from myslice.theme import ThemeView

import json, time

class SliceRequestView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'slicerequest_view.html'
    
    # because we inherit LoginRequiredAutoLogoutView that is implemented by redefining 'dispatch'
    # we cannot redefine dispatch here, or we'd lose LoginRequired and AutoLogout behaviours
    def post (self, request):
        return self.get_or_post (request, 'POST')

    def get (self, request):
        return self.get_or_post (request, 'GET')

    def get_or_post  (self, wsgi_request, method):
        """
        """
        errors = []

        # Retrieve the list of authorities
        authorities_query = Query.get('authority').select('name', 'authority_hrn')
        authorities = execute_admin_query(wsgi_request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities)

        # Get user_hrn (XXX Would deserve to be simplified)
        user_query  = Query().get('local:user').select('email')
        user_emails = execute_query(wsgi_request, user_query)
        user_email = user_emails[0].get('email')
        #
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        account_details = execute_query(wsgi_request, account_query)
        #
        platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
        platform_details = execute_query(wsgi_request, platform_query)
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
                        acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')


        # checking if pi or not
        if acc_auth_cred == {}:
            pi = "is_not_pi"
        else:
            pi = "is_pi"


        # Page rendering
        page = Page(wsgi_request)
        page.add_css_files ( [ "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )

        if method == 'POST':
            # The form has been submitted

            # get the domain url
            current_site = Site.objects.get_current()
            current_site = current_site.domain

            slice_request = {
                'type'              : 'slice',
                'id'                : None,
                'user_hrn'          : user_hrn,
                'email'             : user_email,
                'timestamp'         : time.time(),
                'authority_hrn'     : wsgi_request.POST.get('authority_hrn', ''),
                'slice_name'        : wsgi_request.POST.get('slice_name', ''),
                'number_of_nodes'   : wsgi_request.POST.get('number_of_nodes', ''),
                'purpose'           : wsgi_request.POST.get('purpose', ''),
                'current_site'      : current_site
            }
            
            authority_hrn = slice_request['authority_hrn']
            if (authority_hrn is None or authority_hrn == ''):
                errors.append('Please, select an authority')

            # What kind of slice name is valid?
            slice_name = slice_request['slice_name']
            if (slice_name is None or slice_name == ''):
                errors.append('Slice Name is mandatory')
    
            purpose = slice_request['purpose']
            if (purpose is None or purpose == ''):
                errors.append('Purpose is mandatory')

            if not errors:
                if is_pi(wsgi_request, user_hrn, authority_hrn):
                    # PIs can directly create slices in their own authority...
                    create_slice(wsgi_request, slice_request)
                    self.template_name = 'slice-request-done-view.html'
                else:
                    # Otherwise a wsgi_request is sent to the PI
                    create_pending_slice(wsgi_request, slice_request, user_email)
                    self.template_name = 'slice-request-ack-view.html'
                
                return render(wsgi_request, self.template, {'theme': self.theme}) # Redirect after POST
        else:
            slice_request = {}

        template_env = {
            'username': wsgi_request.user.email,
            'topmenu_items': topmenu_items_live('Request a slice', page),
            'errors': errors,
            'email': user_email,
            'user_hrn': user_hrn,
            'pi': pi,        
            'cc_myself': True,
            'authorities': authorities,
            'theme': self.theme,
            'section': "Slice request"
        }
        template_env.update(slice_request)
        template_env.update(page.prelude_env())
        return render(wsgi_request, self.template, template_env)
