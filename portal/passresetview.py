import os.path, re
import json

from random                     import choice

from django.core.mail           import send_mail

from django.views.generic       import View
from django.shortcuts           import render

from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items_live

from manifold.manifoldapi       import execute_admin_query
from manifold.core.query        import Query

from portal.forms               import PassResetForm
from portal.actions             import manifold_update_user


class PassResetView (FreeAccessView):
    def post (self, request):   
        form = PassResetForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            # Process the data in form.cleaned_data
            email = form.cleaned_data['email'] # email of the user
            
            sender = 'support@myslice.info'
            #recipients = authority_get_pi_emails(authority_hrn)
            recipients = [email ]
            pass_list = ['demo', 'test', 'abcdef']
            reset_pass = choice (pass_list)           
            msg = "Your password has been reset to: %s"% reset_pass + "\n\n Please use this temporary password to login and reset your password from MyAccount page."
            print "test ", msg 
            send_mail("Onelab Portal: Password reset request", msg, sender, recipients)
            return render(request,'pass_reset_sent.html') # Redirect after POST
        else:
            return self._display (request, form)

    def get (self, request):
        return self._display (request, PassResetForm()) # A fresh unbound form

    def _display (self, request, form):
        return render(request, 'pass_reset.html', {
                'form': form,
                })
                                                                                                       
