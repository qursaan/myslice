import os.path, re
import json

from random                     import choice

from django.core.mail           import send_mail
from django.contrib             import messages
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
            email = form.cleaned_data['email'] # email inserted on the form

            user_query  = Query().get('local:user').select('user_id','email')
            user_details = execute_admin_query(self.request, user_query)
            
            for user_detail in user_details:
                if user_detail['email']==email:
                    sender = 'support@myslice.info'
                    #recipients = authority_get_pi_emails(authority_hrn)
                    recipients = [email ]
                    pass_list = ['demo', 'test', 'abcdef']
                    reset_pass = choice (pass_list)           
                    msg = "Your password has been reset to: %s"% reset_pass + "\n\n Please use this temporary password to login and reset your password from MyAccount page."
                    send_mail("Onelab Portal: Password reset request", msg, sender, recipients)
                    return render(request,'pass_reset_sent.html') # Redirect after POST
            else:
                messages.error(request, 'Sorry, this email is not registered.')
                return self._display (request, form)

        else:
            return self._display (request, form)

    def get (self, request):
        return self._display (request, PassResetForm()) # A fresh unbound form

    def _display (self, request, form):
        return render(request, 'pass_reset.html', {
                'form': form,
                })
                                                                                                       
