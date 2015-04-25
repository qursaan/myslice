import json
import os
import re
import itertools

from django.http                        import HttpResponse, HttpResponseRedirect
from django.contrib                     import messages
from django.contrib.auth.decorators     import login_required
from django.core.mail                   import EmailMultiAlternatives, send_mail
from django.contrib.sites.models        import Site

from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query, execute_admin_query

from unfold.loginrequired               import FreeAccessView

from portal.actions                     import (
    manifold_update_user, manifold_update_account, manifold_add_account,
    manifold_delete_account, sfa_update_user, authority_get_pi_emails,
    make_request_user, create_user, send_email_to_pis)
from portal.models                      import PendingUser, PendingAuthority

from unfold.page                        import Page    
from ui.topmenu                         import topmenu_items_live, the_user

from myslice.theme                      import ThemeView
from myslice.settings                   import logger


def ValuesQuerySetToDict(vqs):
    return [item for item in vqs]

# requires login
class ActivateEmailView(FreeAccessView, ThemeView):
    template_name = "email_activation.html"
    def is_ple_enabled(self, pending_user):
        pending_authorities = PendingAuthority.objects.filter(site_authority__iexact = pending_user.authority_hrn)
        if pending_authorities:
            return False                        
        pending_user_email = pending_user.email
        try:
            query = Query.get('myplcuser').filter_by('email', '==', pending_user_email).select('enabled')
            results = execute_admin_query(self.request, query)
            for result in results:
                # User is enabled in PLE
                if 'enabled' in result and result['enabled']==True:
                    return True
        except Exception as e:
            logger.error("Exception in myplc query = {}".format(e))

        return False

    def dispatch(self, *args, **kwargs):
        return super(ActivateEmailView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):

        page = Page(self.request)
        #page.add_js_files  ( [ "js/jquery.validate.js", "js/my_account.register.js", "js/my_account.edit_profile.js" ] )
        #page.add_css_files ( [ "css/onelab.css", "css/account_view.css","css/plugin.css" ] )

        for key, value in kwargs.iteritems():
            if key == "hash_code":
                hash_code=value

        if PendingUser.objects.filter(email_hash__iexact = hash_code).filter(status__iexact = 'False'):           
            activation = 'success'
            pending_users = PendingUser.objects.filter(email_hash__iexact = hash_code)
            pending_user = pending_users[0]

            # AUTO VALIDATION of PLE enabled users (only for OneLab Portal)
            if self.theme == "onelab":
                # Auto-Validation of pending user, which is enabled in a trusted SFA Registry (example: PLE)
                # We could check in the Registry based on email, but it takes too long 
                # as we currently need to do a Resolve on each user_hrn of the Registry in order to get its email
                # TODO in SFA XXX We need a Resolve based on email
                # TODO maybe we can use MyPLC API for PLE

                # by default user is not in PLE
                ple_user_enabled = False

                if pending_user:
                    # Auto Validation 
                    if self.is_ple_enabled(pending_user):
                        pending_user_request = make_request_user(pending_user)
                        # Create user in SFA and Update in Manifold
                        create_user(self.request, pending_user_request, namespace = 'myslice', as_admin = True)
                        # Delete pending user
                        PendingUser.objects.filter(email_hash__iexact = hash_code).delete()

                        # template user auto validated
                        activation = 'validated'
            
            PendingUser.objects.filter(email_hash__iexact = hash_code).update(status='True')
            u = {}
            u['first_name']    =  pending_user.first_name   
            u['last_name']     =  pending_user.last_name    
            u['authority_hrn'] =  pending_user.authority_hrn
            u['email']         =  pending_user.email        
            u['user_hrn']      =  pending_user.user_hrn     
            u['pi']            =  pending_user.pi           

            send_email_to_pis(self.request, u, 'user')
        else:
            activation = 'failed'
        
        # get the domain url
        current_site = Site.objects.get_current()
        current_site = current_site.domain

        
        context = super(ActivateEmailView, self).get_context_data(**kwargs)
        context['activation_status'] = activation
        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('My Account', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)
        #context['first_name'] = first_name
        #context['last_name'] = last_name
        #context['authority_hrn'] = authority_hrn
        #context['public_key'] = public_key
        #context['email'] = email
        #context['user_hrn'] = user_hrn
        #context['current_site'] = current_site
        context['theme'] = self.theme
#        context ['firstname'] = config['firstname']
        prelude_env = page.prelude_env()
        context.update(prelude_env)
        return context
