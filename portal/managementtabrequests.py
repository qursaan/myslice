from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse
from django.shortcuts               import render

from manifold.core.query            import Query, AnalyzedQuery
from manifoldapi.manifoldapi        import execute_query

from portal.actions                 import get_requests

from myslice.theme import ThemeView

import json

class ManagementRequestsView (LoginRequiredView, ThemeView):
    template_name = "management-tab-requests.html"
    
    def get_context_data(self, **kwargs):
       
        ctx_my_authorities = {}
        ctx_delegation_authorities = {}
        ctx_sub_authorities = {}
        dest = {}


        # The user need to be logged in
        if (self.request.user):
           
            user_query = Query().get('local:user').filter_by('email', '==', self.request.user.email).select('user_id')
            user, = execute_query(self.request, user_query)
            user_id = user['user_id']

            # Query manifold to learn about available SFA platforms for more information
            # In general we will at least have the portal
            # For now we are considering all registries
            all_authorities = []
            platform_ids = []
            sfa_platforms_query = Query().get('local:platform').filter_by('gateway_type', '==', 'sfa').select('platform_id', 'platform', 'auth_type')
            sfa_platforms = execute_query(self.request, sfa_platforms_query)
            for sfa_platform in sfa_platforms:
                print "SFA PLATFORM > ", sfa_platform['platform']
                if not 'auth_type' in sfa_platform:
                    continue
                auth = sfa_platform['auth_type']
                if not auth in all_authorities:
                    all_authorities.append(auth)
                platform_ids.append(sfa_platform['platform_id'])

            print "W: Hardcoding platform myslice"
            # There has been a tweak on how new platforms are referencing a
            # so-called 'myslice' platform for storing authentication tokens.
            # XXX This has to be removed in final versions.
            myslice_platforms_query = Query().get('local:platform').filter_by('platform', '==', 'myslice').select('platform_id')
            myslice_platforms = execute_query(self.request, myslice_platforms_query)
            if myslice_platforms:
                myslice_platform, = myslice_platforms
                platform_ids.append(myslice_platform['platform_id'])

            # We can check on which the user has authoritity credentials = PI rights
            credential_authorities = set()
            credential_authorities_expired = set()

            # User account on these registries
            user_accounts_query = Query.get('local:account').filter_by('user_id', '==', user_id).filter_by('platform_id', 'included', platform_ids).select('auth_type', 'config')
            user_accounts = execute_query(self.request, user_accounts_query)
            
            for user_account in user_accounts:

                print "USER ACCOUNT", user_account
                if user_account['auth_type'] == 'reference':
                    continue # we hardcoded the myslice platform...

                config = json.loads(user_account['config'])
                creds = []
                print "CONFIG KEYS", config.keys()
                if 'authority_credentials' in config:
                    print "***", config['authority_credentials'].keys()
                    for authority_hrn, credential in config['authority_credentials'].items():
                        credential_authorities.add(authority_hrn)
                if 'delegated_authority_credentials' in config:
                    print "***", config['delegated_authority_credentials'].keys()
                    for authority_hrn, credential in config['delegated_authority_credentials'].items():
                        credential_authorities.add(authority_hrn)

            print 'credential_authorities =', credential_authorities
            print 'credential_authorities_expired =', credential_authorities_expired

            # ** Where am I a PI **
            # For this we need to ask SFA (of all authorities) = PI function
            pi_authorities_query = Query.get('user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')
            pi_authorities_tmp = execute_query(self.request, pi_authorities_query)
            pi_authorities = set()
            try:
                for pa in pi_authorities_tmp:
                    pi_authorities |= set(pa['pi_authorities'])
            except:
                print 'No pi_authorities'

            pi_credential_authorities = pi_authorities & credential_authorities
            pi_no_credential_authorities = pi_authorities - credential_authorities - credential_authorities_expired
            pi_expired_credential_authorities = pi_authorities & credential_authorities_expired
            # Authorities I've been delegated PI rights
            pi_delegation_credential_authorities = credential_authorities - pi_authorities
            pi_delegation_expired_authorities = credential_authorities_expired - pi_authorities

            # Summary intermediary
            pi_my_authorities = pi_credential_authorities | pi_no_credential_authorities | pi_expired_credential_authorities
            pi_delegation_authorities = pi_delegation_credential_authorities | pi_delegation_expired_authorities

            # Summary all
            queried_pending_authorities = pi_my_authorities | pi_delegation_authorities #| pi_subauthorities

            # iterate on the requests and check if the authority matches a prefix 
            # startswith an authority on which the user is PI
            requests = get_requests()
            for r in requests:
                auth_hrn = r['authority_hrn']
                for my_auth in pi_my_authorities: 
                    if auth_hrn.startswith(my_auth):
                        dest = ctx_my_authorities
                        r['allowed'] = 'allowed'
                for my_auth in pi_delegation_authorities:
                    if auth_hrn.startswith(my_auth):
                        dest = ctx_delegation_authorities
                        r['allowed'] = 'allowed'
                if auth_hrn in pi_expired_credential_authorities:
                    r['allowed'] = 'expired'
                if 'allowed' not in r:
                    ## TEMP FIX for allowing new authority registration
                    #r['allowed'] = 'denied'
                    r['allowed'] = 'allowed'

                if not auth_hrn in dest:
                    dest[auth_hrn] = []
                dest[auth_hrn].append(r)
                
              
#         env = {}
#         env['my_authorities']   = ctx_my_authorities
#         env['sub_authorities']   = ctx_sub_authorities
#         env['delegation_authorities'] = ctx_delegation_authorities
# 
#         # XXX This is repeated in all pages
#         # more general variables expected in the template
#         # the menu items on the top
#         #env['topmenu_items'] = topmenu_items_live('Validation', page) 
#         # so we can sho who is logged
#         env['username'] = request.user
#         env['pi'] = "is_pi"       
#         env['theme'] = self.theme
#         env['section'] = "Requests"
        
        context = super(ManagementRequestsView, self).get_context_data(**kwargs)
        print "testing"
        for s in ctx_my_authorities :
            print s
            
        context['my_authorities']   = ctx_my_authorities
        context['sub_authorities']   = ctx_sub_authorities
        context['delegation_authorities'] = ctx_delegation_authorities

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        #context['topmenu_items'] = topmenu_items_live('Validation', page) 
        # so we can sho who is logged
        context['username'] = self.request.user 
        context['pi'] = "is_pi"       
        context['theme'] = self.theme
        context['section'] = "Requests"
        # XXX We need to prepare the page for queries
        #context.update(page.prelude_env())

        return context
    
        #return render_to_response(self.template, env, context_instance=RequestContext(request))
