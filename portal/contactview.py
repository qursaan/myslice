from django.shortcuts           import render
from django.template.loader     import render_to_string
from django.views.generic       import View

from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items, the_user
from django.core.mail           import EmailMultiAlternatives, send_mail
from portal.forms               import ContactForm
from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query
import json

from myslice.theme import ThemeView
theme = ThemeView()

# splitting the 2 functions done here
# GET is for displaying the empty form
# POST is to process it once filled - or show the form again if anything is missing
class ContactView (FreeAccessView, ThemeView):
    template_name = 'contact.html'
    def post (self, request):
        form = ContactForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            # Process the data in form.cleaned_data
            #first_name = form.cleaned_data['first_name']
            #last_name = form.cleaned_data['last_name']
            #authority = form.cleaned_data['authority']
            subject = form.cleaned_data['subject']
            description = form.cleaned_data['description']
            email = form.cleaned_data['email'] # email of the sender
            cc_myself = form.cleaned_data['cc_myself']

            #try:
                # Send an email: the support recipients
            #theme.template_name = 'email_support.txt'
            #recipients = render_to_string(theme.template, form.cleaned_data)
            #recipients = subject.replace('\n', '')
            recipients = ['support@myslice.info']
            if cc_myself:
                recipients.append(email)
            #recipients = ['support@myslice.info']
            theme.template_name = 'contact_support_email.html'
            html_content = render_to_string(theme.template, form.cleaned_data)
        
            theme.template_name = 'contact_support_email.txt'
            text_content = render_to_string(theme.template, form.cleaned_data)
        
            theme.template_name = 'contact_support_email_subject.txt'
            subject = render_to_string(theme.template, form.cleaned_data)
            subject = subject.replace('\n', '')
        
            #    if not email:
            #        theme.template_name = 'email_default_sender.txt'
            #        sender =  render_to_string(theme.template, form.cleaned_data)
            #        sender = sender.replace('\n', '')
            #    else:
            sender = email
        
            msg = EmailMultiAlternatives(subject, text_content, sender, recipients)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            #except Exception, e:
                #print "Failed to send email, please check the mail templates and the SMTP configuration of your server"

            if request.user.is_authenticated() :
                username = request.user.email
            else :
                username = None
            return render(request,'contact_sent.html', { 'theme' : self.theme,  'username': username}) # Redirect after POST
        else:
            return self._display (request, form)

    def get (self, request):
        return self._display (request, ContactForm()) # A fresh unbound form
        
    def _display (self, request, form):
        if request.user.is_authenticated():
            username = request.user.email
            ## check user is pi or not
            platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
            account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
            platform_details = execute_query(self.request, platform_query)
            account_details = execute_query(self.request, account_query)
            for platform_detail in platform_details:
                for account_detail in account_details:
                    if platform_detail['platform_id'] == account_detail['platform_id']:
                        if 'config' in account_detail and account_detail['config'] is not '':
                            account_config = json.loads(account_detail['config'])
                            if 'myslice' in platform_detail['platform']:
                                acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
            # assigning values
            if acc_auth_cred == {} or acc_auth_cred == 'N/A':
                pi = "is_not_pi"
            else:
                pi = "is_pi"
        else :
            username = None
            pi = "is_not_pi"
        return render(request, self.template, {
                'form': form,
                'topmenu_items': topmenu_items('Contact', request),
                'theme' : self.theme,
                'username': username,
                'pi': pi,
                'section': "Contact",
                'email': request.user.username
                })
