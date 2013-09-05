from django.shortcuts           import render

from django.views.generic       import View

from myslice.viewutils          import topmenu_items, the_user

from portal.forms               import ContactForm

# view for contact form
class ContactView (View):
  def dispatch(self, request):
    if request.method == 'POST': # If the form has been submitted...
        form = ContactForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            # Process the data in form.cleaned_data
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            affiliation = form.cleaned_data['affiliation']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            email = form.cleaned_data['email'] # email of the sender
            cc_myself = form.cleaned_data['cc_myself']

            #recipients = authority_get_pi_emails(authority_hrn)
            recipients = ['yasin.upmc@gmail.com', 'thierry.parmentelat@inria.fr', ]
            if cc_myself:
                recipients.append(email)

            from django.core.mail import send_mail
            send_mail("Onelab user submitted a query ", [first_name,last_name,affiliation,subject,message], email, recipients)
            return render(request,'contact_sent.html') # Redirect after POST
    else:
        form = ContactForm() # An unbound form
    
    return render(request, 'contact.html', {
        'form': form,
        'topmenu_items': topmenu_items('Contact Us', request),
        'username': the_user (request)

    })

