from django.shortcuts           import render
from django.contrib.sites.models import Site


from unfold.page                import Page

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_admin_query, execute_query

from portal.actions             import is_pi, create_slice, create_pending_slice, clear_user_creds
#from portal.forms               import SliceRequestForm
from unfold.loginrequired       import LoginRequiredAutoLogoutView
from ui.topmenu                 import topmenu_items_live, the_user

from myslice.theme import ThemeView

import json, time, re

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
        slice_name =''
        purpose=''
        url=''
        authority_hrn = None
        authority_name = None
        # Retrieve the list of authorities
        authorities_query = Query.get('authority').select('name', 'authority_hrn')
        authorities = execute_admin_query(wsgi_request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities)

        # Get user_email (XXX Would deserve to be simplified)
        user_query  = Query().get('local:user').select('email','config')
        user_details = execute_query(wsgi_request, user_query)
        user_email = user_details[0].get('email')
        # getting user_hrn
        for user_detail in user_details:
            user_config = json.loads(user_detail['config'])
            user_authority = user_config.get('authority','N/A')              
        # getting the org from authority        
        for authority in authorities:
            if authority['authority_hrn'] == user_authority:
                authority_name = authority['name']

        # Handle the case when we use only hrn and not name
        if authority_name is None:
            authority_name = user_authority
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
        if acc_auth_cred == {} or acc_auth_cred == 'N/A':
            pi = "is_not_pi"
        else:
            pi = "is_pi"


        # Page rendering
        page = Page(wsgi_request)
        page.add_js_files  ( [ "js/jquery.validate.js", "js/jquery-ui.js" ] )
        page.add_css_files ( [ "https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" ] )
        page.expose_js_metadata()

        if method == 'POST':
            # The form has been submitted

            # get the domain url
            current_site = Site.objects.get_current()
            current_site = current_site.domain
            
            # getting the authority_hrn from the selected organization
            for authority in authorities:
                if authority['name'] == wsgi_request.POST.get('org_name', ''):
                    authority_hrn = authority['authority_hrn']

            # Handle the case when we use only hrn and not name
            if authority_hrn is None:
                authority_hrn = wsgi_request.POST.get('org_name', '')

            slice_request = {
                'type'              : 'slice',
                'id'                : None,
                'user_hrn'          : user_hrn,
                'email'             : user_email,
                'timestamp'         : time.time(),
                'authority_hrn'     : authority_hrn,
                'organization'      : wsgi_request.POST.get('org_name', ''),
                'slice_name'        : wsgi_request.POST.get('slice_name', ''),
                'url'               : wsgi_request.POST.get('url', ''),
                'purpose'           : wsgi_request.POST.get('purpose', ''),
                'current_site'      : current_site
            }
            
            # create slice_hrn based on authority_hrn and slice_name
            slice_name = slice_request['slice_name']
            req_slice_hrn = authority_hrn + '.' + slice_name
            # comparing requested slice_hrn with the existing slice_hrn 
            slice_query  = Query().get('slice').select('slice_hrn','parent_authority').filter_by('parent_authority','==',authority_hrn)
            slice_details_sfa = execute_admin_query(wsgi_request, slice_query)
            for _slice in slice_details_sfa:
                if _slice['slice_hrn'] == req_slice_hrn:
                    errors.append('Slice already exists. Please use a different slice name.')
            

            # What kind of slice name is valid?
            if (slice_name is None or slice_name == ''):
                errors.append('Slice name is mandatory')
            
            if (re.search(r'^[A-Za-z0-9_]*$', slice_name) == None):
                errors.append('Slice name may contain only letters, numbers, and underscore.')
            
            organization = slice_request['organization']    
            if (organization is None or organization == ''):
                errors.append('Organization is mandatory')


    
            purpose = slice_request['purpose']
            if (purpose is None or purpose == ''):
                errors.append('Experiment purpose is mandatory')

            url = slice_request['url']

            if not errors:
                if is_pi(wsgi_request, user_hrn, authority_hrn):
                    # PIs can directly create slices in their own authority...
                    create_slice(wsgi_request, slice_request)
                    clear_user_creds(wsgi_request, user_email)
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
            'slice_name': slice_name,
            'purpose': purpose,
            'email': user_email,
            'user_hrn': user_hrn,
            'url': url,
            'pi': pi,
            'authority_name': authority_name,        
            'authority_hrn': user_authority,        
            'cc_myself': True,
            'authorities': authorities,
            'theme': self.theme,
            'section': "Slice request"
        }
        template_env.update(slice_request)
        template_env.update(page.prelude_env())
        return render(wsgi_request, self.template, template_env)
