import json
import time
import re

from django.shortcuts           import render
from django.shortcuts           import render_to_response
from django.template                    import RequestContext

from unfold.page                import Page

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_admin_query, execute_query

from portal.actions             import is_pi, create_slice, create_pending_slice, clear_user_creds, authority_check_pis
#from portal.forms               import SliceRequestForm
from unfold.loginrequired       import LoginRequiredAutoLogoutView
from ui.topmenu                 import topmenu_items_live, the_user

from myslice.theme import ThemeView
from myslice.settings import logger

import activity.user
theme = ThemeView()

class SliceRequestView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'slicerequest_view.html'
    
    # because we inherit LoginRequiredAutoLogoutView that is implemented by redefining 'dispatch'
    # we cannot redefine dispatch here, or we'd lose LoginRequired and AutoLogout behaviours
    def post (self, request):
        return self.get_or_post (request, 'POST')

    def get (self, request):
        return self.get_or_post (request, 'GET')

    def get_or_post  (self, request, method):
        """
        """

        errors = []
        slice_name =''
        purpose=''
        url=''
        authority_hrn = None
        authority_name = None
        # Retrieve the list of authorities
        #if self.theme == 'fed4fire' or self.theme == 'onelab':
        authorities_query = Query.get('myslice:authority').select('authority_hrn')
        #else:
        #    authorities_query = Query.get('authority').select('name', 'authority_hrn')
        authorities = execute_admin_query(request, authorities_query)
        if authorities is not None:
            authorities = sorted(authorities, key=lambda k: k['authority_hrn'])
            #if self.theme != 'fed4fire' or  self.theme != 'onelab':
            #    authorities = sorted(authorities, key=lambda k: k['name'])

        # Get user_email (XXX Would deserve to be simplified)
        user_query  = Query().get('local:user').select('email','config')
        user_details = execute_query(request, user_query)
        user_email = user_details[0].get('email')
        # getting user_hrn
        for user_detail in user_details:
            user_config = json.loads(user_detail['config'])
            user_authority = user_config.get('authority','N/A')              
        # getting the org from authority        
       # for authority in authorities:
       #     if 'name' in authority and authority['authority_hrn'] == user_authority:
       #         authority_name = authority['name']

        # Handle the case when we use only hrn and not name
        #if authority_name is None:
        #    authority_name = user_authority
        
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        account_details = execute_query(request, account_query)
        
        platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
        platform_details = execute_query(request, platform_query)
        user_hrn = None
        #getting user_hrn from local:account
        for account_detail in account_details:
            for platform_detail in platform_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    # taking user_hrn only from myslice account
                    # NOTE: we should later handle accounts filter_by auth_type= managed OR user
                    if 'myslice' in platform_detail['platform']:
                        account_config = json.loads(account_detail['config'])
                        user_hrn = account_config.get('user_hrn','N/A')
        #                acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')


        # checking if pi or not
        #if acc_auth_cred == {} or acc_auth_cred == 'N/A':
        #    pi = "is_not_pi"
        #else:
        #    pi = "is_pi"

        pi = authority_check_pis (request, user_email)
        logger.debug("SLICEREQUESTVIEW.PY -----  pi= {}".format(pi))

        # Page rendering
        page = Page(request)
        page.add_js_files  ( [ "js/jquery.validate.js", "js/jquery-ui.js" ] )
        page.add_css_files ( [ "css/jquery-ui.css" ] )
        page.expose_js_metadata()

        if method == 'POST':
            # The form has been submitted

            if request.is_secure():
                current_site = 'https://'
            else:
                current_site = 'http://'
            current_site += request.META['HTTP_HOST']

            #if theme.theme != 'fed4fire' or  self.theme != 'onelab':
                # getting the authority_hrn from the selected organization
            #    for authority in authorities:
             #       if authority['name'] == request.POST.get('org_name', ''):
              #          authority_hrn = authority['authority_hrn']

            # Handle the case when we use only hrn and not name
            if authority_hrn is None:
                authority_hrn = request.POST.get('org_name', '')

            # Handle project if used
            project = request.POST.get('org_name', None)
            if project is not None and project != '':
                authority_hrn = project
            slice_name = request.POST.get('slice_name', '')
            if not slice_name or len(slice_name) == 0 :
                errors.append('Slice name can\'t be empty')

            # accept only lowercase names
            slice_name = slice_name.lower()

            slice_request = {
                'type'              : 'slice',
                'id'                : None,
                'user_hrn'          : user_hrn,
                'email'             : user_email,
                'timestamp'         : time.time(),
                'authority_hrn'     : authority_hrn,
                'organization'      : request.POST.get('org_name', ''),
                'slice_name'        : slice_name,
                'url'               : request.POST.get('url', ''),
                'purpose'           : request.POST.get('purpose', ''),
                'current_site'      : current_site
            }

            # slice name is unique among all authorities 
            slice_query = Query().get('myslice:slice').select('slice_hrn')
            slice_details_sfa = execute_admin_query(request, slice_query)
            for _slice in slice_details_sfa:
                split_list = _slice['slice_hrn'].split('.')
                sfa_slice_name = split_list[-1]
                if sfa_slice_name == slice_name:
                    errors.append('Slice already exists. Please use a different slice name.')
            

            # What kind of slice name is valid?
            if slice_name is None or slice_name == '':
                errors.append('Slice name is mandatory')
            
            if re.search(r'^[A-Za-z0-9_]*$', slice_name) is None:
                errors.append('Slice name may contain only letters, numbers, and underscore.')
            
            organization = slice_request['organization']
            if theme.theme == 'fed4fire' or  self.theme == 'onelab':
                if organization is None or organization == '':
                    errors.append('Selecting project is mandatory')
            else:
                if organization is None or organization == '':
                    errors.append('Organization is mandatory')

            slice_length= len(slice_request['slice_name'])
            if slice_length >19:
                errors.append('Slice name can be maximum 19 characters long')


    
            purpose = slice_request['purpose']
            if purpose is None or purpose == '':
                errors.append('Experiment purpose is mandatory')

            url = slice_request['url']

            if not errors:
                if is_pi(request, user_hrn, authority_hrn):
                    # PIs can directly create slices in their own authority...
                    create_slice(request, slice_request)
                    clear_user_creds(request, user_email)
                    self.template_name = 'slice-request-done-view.html'
                else:
                    # Otherwise a request is sent to the PI
                    create_pending_slice(request, slice_request, user_email)
                    self.template_name = 'slice-request-ack-view.html'
                
                # log user activity
                activity.user.slice(request)
                return render_to_response(self.template, {'theme': self.theme, 'request':request}, context_instance=RequestContext(request))
                #return render(request, self.template, {'theme': self.theme}) # Redirect after POST
        else:
            slice_request = {}

        template_env = {
            'username': request.user.email,
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
            'section': "Slice request",
            'request': request,
        }
        template_env.update(slice_request)
        template_env.update(page.prelude_env())

        return render_to_response(self.template,template_env, context_instance=RequestContext(request))
        #return render(request, self.template, template_env)
