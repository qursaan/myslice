from unfold.loginrequired               import FreeAccessView
#
from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query, execute_admin_query
from portal.actions                     import manifold_update_user, manifold_update_account, manifold_add_account, manifold_delete_account, sfa_update_user, authority_get_pi_emails
#
from unfold.page                        import Page    
from ui.topmenu                         import topmenu_items_live, the_user
#
from django.http                        import HttpResponse, HttpResponseRedirect
from django.contrib                     import messages
from django.contrib.auth.decorators     import login_required
from myslice.theme                      import ThemeView
from portal.models                      import PendingUser
from django.core.mail                   import EmailMultiAlternatives, send_mail
from django.contrib.sites.models        import Site

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
            #for user in PendingUser.objects.all():
            #    first_name = user.first_name
            #    last_name = user.last_name
            #    authority_hrn = user.authority_hrn
            #    public_key = user.public_key
            #    email = user.email
            #    user_hrn = user.user_hrn
            PendingUser.objects.filter(email_hash__iexact = hash_code).update(status='True')
            activation = 'success'
            # sending email after activation success
            #try:
                # Send an email: the recipients are the PI of the authority
                # If No PI is defined for this Authority, send to a default email (different for each theme)
             #   recipients = authority_get_pi_emails(wsgi_request, authority_hrn)
             #   theme.template_name = 'user_request_email.html'
             #   html_content = render_to_string(theme.template, request)
             #   theme.template_name = 'user_request_email.txt'
             #   text_content = render_to_string(theme.template, request)
             #   theme.template_name = 'user_request_email_subject.txt'
             #   subject = render_to_string(theme.template, request)
             #   subject = subject.replace('\n', '')
             #   theme.template_name = 'email_default_sender.txt'
             #   sender =  render_to_string(theme.template, request)
             #   sender = sender.replace('\n', '')
             #   msg = EmailMultiAlternatives(subject, text_content, sender, recipients)
             #   msg.attach_alternative(html_content, "text/html")
             #   msg.send()
           # except Exception, e:
             #   print "Failed to send email, please check the mail templates and the SMTP configuration of your server"
             #   import traceback
             #   traceback.print_exc()

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
