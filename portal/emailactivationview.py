from unfold.loginrequired               import FreeAccessView
#
from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query, execute_admin_query
from portal.actions                     import manifold_update_user, manifold_update_account, manifold_add_account, manifold_delete_account, sfa_update_user
#
from unfold.page                        import Page    
from ui.topmenu                         import topmenu_items_live, the_user
#
from django.http                        import HttpResponse, HttpResponseRedirect
from django.contrib                     import messages
from django.contrib.auth.decorators     import login_required
from myslice.theme                      import ThemeView
from portal.models                      import PendingUser
#
import json, os, re, itertools

# requires login
class ActivateEmailView(FreeAccessView, ThemeView):
    template_name = "email_activation.html"
    def dispatch(self, *args, **kwargs):
        return super(ActivateEmailView, self).dispatch(*args, **kwargs)


    def get_context_data(self, **kwargs):

        page = Page(self.request)
        #page.add_js_files  ( [ "js/jquery.validate.js", "js/my_account.register.js", "js/my_account.edit_profile.js" ] )
        #page.add_css_files ( [ "css/onelab.css", "css/account_view.css","css/plugin.css" ] )

        for key, value in kwargs.iteritems():
            #print "%s = %s" % (key, value)
            if key == "hash_code":
                hash_code=value
       
        if PendingUser.objects.filter(email_hash__iexact = hash_code):
            #get_user = PendingUser.objects.filter(email_hash__iexact = hash_code)
            #get_user.status= 'True'
            #get_user.save()
            PendingUser.objects.filter(email_hash__iexact = hash_code).update(status='True')
            activation = 'success'
        else:
            activation = 'failed'

        context = super(ActivateEmailView, self).get_context_data(**kwargs)
        context['activation_status'] = activation
        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('My Account', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)
        context['theme'] = self.theme
#        context ['firstname'] = config['firstname']
        prelude_env = page.prelude_env()
        context.update(prelude_env)
        return context
