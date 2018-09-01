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

import activity.user

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
            #cc_myself = form.cleaned_data['cc_myself']

            #try:
                # Send an email: the support recipients
            theme.template_name = 'email_default_recipients.txt'
            recipients = render_to_string(theme.template, form.cleaned_data)
            recipients = recipients.replace('\n', '')
            #recipients = ['support@onelab.eu']
            ## removed it cz recipients is not a list so append doesn't work ###
            ## we don't need it cz the new ticketing systems sends a confirmation email ###
            #if cc_myself:
            #    recipients.append(email)
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
        
            msg = EmailMultiAlternatives(subject, text_content, sender, [recipients])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            #except Exception, e:
                #print "Failed to send email, please check the mail templates and the SMTP configuration of your server"

            if request.user.is_authenticated() :
                username = request.user.email
            else :
                username = None
            # log user activity
            activity.user.contact(self.request)
            return render(request,'contact_sent.html', { 'theme' : self.theme,  'username': username, 'request':request}) # Redirect after POST
        else:
            return self._display (request, form)

    def get (self, request):
        return self._display (request, ContactForm()) # A fresh unbound form
        
    def _display (self, request, form):
        if request.user.is_authenticated():
            username = request.user.email
        else :
            username = None
            pi = "is_not_pi"
        return render(request, self.template, {
                'form': form,
                'topmenu_items': topmenu_items('Contact', request),
                'theme' : self.theme,
                'username': username,
                'section': "Contact",
                'request': request,
                })
