# -*- coding: utf-8 -*-
#
# portal/views.py: views for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr>
#   Mohammed Yasin Rahman <mohammed-yasin.rahman@lip6.fr>
# Copyright 2013, UPMC Sorbonne Universités / LIP6
#
# This program is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 3, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
# details.
# 
# You should have received a copy of the GNU General Public License along with
# this program; see the file COPYING.  If not, write to the Free Software
# Foundation, 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

import os.path, re
import json

from django.views.generic.base   import TemplateView
from django.shortcuts            import render
from django.template.loader      import render_to_string
from django.core.mail            import send_mail
from django.utils.decorators     import method_decorator
from django.contrib.auth.decorators import login_required

from plugins.lists.simplelist    import SimpleList
from plugins.hazelnut            import Hazelnut
from plugins.pres_view           import PresView
from portal.event import Event

from portal                      import signals
from portal.forms                import SliceRequestForm
from portal.util                 import RegistrationView, ActivationView
from portal.models               import PendingUser, PendingSlice
from portal.actions              import authority_get_pi_emails, get_request_by_authority, manifold_add_user, manifold_update_user
from manifold.manifoldapi        import execute_query
from manifold.core.query         import Query
from unfold.page                 import Page
from myslice.viewutils           import topmenu_items, the_user
from django.http                 import HttpResponseRedirect, HttpResponse


def register_4m_f4f(request):
    errors = []

    authorities_query = Query.get('authority').filter_by('authority_hrn', 'included', ['ple.inria', 'ple.upmc']).select('name', 'authority_hrn')
    #authorities_query = Query.get('authority').select('authority_hrn')
    authorities = execute_query(request, authorities_query)

    if request.method == 'POST':
        # We shall use a form here

        #get_email = PendingUser.objects.get(email)
        reg_fname = request.POST.get('firstname', '')
        reg_lname = request.POST.get('lastname', '')
        #reg_aff = request.POST.get('affiliation','')
        reg_auth = request.POST.get('authority_hrn', '')
        reg_email = request.POST.get('email','').lower()
        
        #POST value validation  
        if (re.search(r'^[\w+\s.@+-]+$', reg_fname)==None):
            errors.append('First Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            #return HttpResponse("Only Letters, Numbers, - and _ allowd in First Name")
            #return render(request, 'register_4m_f4f.html')
        if (re.search(r'^[\w+\s.@+-]+$', reg_lname) == None):
            errors.append('Last Name may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            #return HttpResponse("Only Letters, Numbers, - and _ is allowed in Last name")
            #return render(request, 'register_4m_f4f.html')
#        if (re.search(r'^[\w+\s.@+-]+$', reg_aff) == None):
#            errors.append('Affiliation may contain only letters, numbers, spaces and @/./+/-/_ characters.')
            #return HttpResponse("Only Letters, Numbers and _ is allowed in Affiliation")
            #return render(request, 'register_4m_f4f.html')
        # XXX validate authority hrn !!
        if PendingUser.objects.filter(email__iexact=reg_email):
            errors.append('Email already registered.Please provide a new email address.')
            #return HttpResponse("Email Already exists")
            #return render(request, 'register_4m_f4f.html')
        if 'generate' in request.POST['question']:
            # Generate public and private keys using SFA Library
            from sfa.trust.certificate  import Keypair
            k = Keypair(create=True)
            public_key = k.get_pubkey_string()
            private_key = k.as_pem()
            private_key = ''.join(private_key.split())
            public_key = "ssh-rsa " + public_key
            # Saving to DB
            keypair = '{"user_public_key":"'+ public_key + '", "user_private_key":"'+ private_key + '"}'
#            keypair = re.sub("\r", "", keypair)
#            keypair = re.sub("\n", "\\n", keypair)
#            #keypair = keypair.rstrip('\r\n')
#            keypair = ''.join(keypair.split())
        else:
            up_file = request.FILES['user_public_key']
            file_content =  up_file.read()
            file_name = up_file.name
            file_extension = os.path.splitext(file_name)[1]
            allowed_extension =  ['.pub','.txt']
            if file_extension in allowed_extension and re.search(r'ssh-rsa',file_content):
                keypair = '{"user_public_key":"'+ file_content +'"}'
                keypair = re.sub("\r", "", keypair)
                keypair = re.sub("\n", "\\n",keypair)
                keypair = ''.join(keypair.split())
            else:
                errors.append('Please upload a valid RSA public key [.txt or .pub].')

        #b = PendingUser(first_name=reg_fname, last_name=reg_lname, affiliation=reg_aff, 
        #                email=reg_email, password=request.POST['password'], keypair=keypair)
        #b.save()
        if not errors:
            b = PendingUser(
                first_name=reg_fname, 
                last_name=reg_lname, 
                #affiliation=reg_aff,
                authority_hrn=reg_auth,
                email=reg_email, 
                password=request.POST['password'],
                keypair=keypair
            )
            b.save()

            # Send email
            ctx = {
                first_name   : reg_fname, 
                last_name    : reg_lname, 
                #affiliation  : reg_aff,
                authority_hrn: reg_auth,
                email        : reg_email, 
                keypair      : keypair,
                cc_myself    : True # form.cleaned_data['cc_myself']
            }

            recipients = authority_get_pi_emails(authority_hrn)
            if ctx['cc_myself']:
                recipients.append(ctx['email'])

            msg = render_to_string('user_request_email.txt', ctx)
            send_mail("Onelab New User request submitted", msg, email, recipients)

            return render(request, 'user_register_complete.html')

    return render(request, 'register_4m_f4f.html',{
        'topmenu_items': topmenu_items('Register', request),
        'errors': errors,
        'firstname': request.POST.get('firstname', ''),
        'lastname': request.POST.get('lastname', ''),
        #'affiliation': request.POST.get('affiliation', ''),
        'authority_hrn': request.POST.get('authority_hrn', ''),
        'email': request.POST.get('email', ''),
        'password': request.POST.get('password', ''),           
        'authorities': authorities
    })        
    

@login_required
def slice_request(request):
    errors = []

    authorities_query = Query.get('authority').filter_by('authority_hrn', 'included', ['ple.inria', 'ple.upmc']).select('name', 'authority_hrn')
    #authorities_query = Query.get('authority').select('authority_hrn')
    authorities = execute_query(request, authorities_query)

    authority_hrn_tuple = []
    for authority in authorities:
        authority_hrn_tuple.append((authority['authority_hrn'], authority['name']))
    authority_hrn_initial = {'authority_hrn': authority_hrn_tuple}
        
    # request.POST or None ?
    if request.method == 'POST':
        # The form has been submitted
        form = SliceRequestForm(request.POST, initial=authority_hrn_initial) 

        if form.is_valid():
            slice_name      = form.cleaned_data['slice_name']
            authority_hrn   = form.cleaned_data['authority_hrn']
            number_of_nodes = form.cleaned_data['number_of_nodes']
            type_of_nodes   = form.cleaned_data['type_of_nodes']
            purpose         = form.cleaned_data['purpose']
            
            s = PendingSlice(
                slice_name      = slice_name,
                authority_hrn   = authority_hrn,
                number_of_nodes = number_of_nodes,
                type_of_nodes   = type_of_nodes,
                purpose         = purpose
            )
            s.save()

            # All validation rules pass; process data in form.cleaned_data
            # slice_name, number_of_nodes, type_of_nodes, purpose
            email = form.cleaned_data['email'] # email of the sender
            cc_myself = form.cleaned_data['cc_myself']

            # The recipients are the PI of the authority
            recipients = authority_get_pi_emails(authority_hrn)
            #recipients = ['yasin.upmc@gmail.com','jordan.auge@lip6.fr']
            if cc_myself:
                recipients.append(email)
            msg = render_to_string('slice_request_email.txt', form.cleaned_data)
            send_mail("Onelab New Slice request form submitted", msg, email, recipients)

            return render(request,'slicereq_recvd.html') # Redirect after POST
    else:
        form = SliceRequestForm(initial=authority_hrn_initial)

#    template_env = {}
#    template_env['form'] = form
#    template_env['topmenu_items'] = topmenu_items('Request a slice', request) 
#    template_env['unfold1_main'] = render(request, 'slice_request_.html', {
#        'form': form,
#    })
#    from django.shortcuts                import render_to_response
#    from django.template                 import RequestContext
#    return render_to_response ('view-unfold1.html',template_env,
#                               context_instance=RequestContext(request))

    return render(request, 'slice_request.html', {
        'form': form,
        'topmenu_items': topmenu_items('Request a slice', request),
        'username': the_user (request) 
    })


class PresViewView(TemplateView):
    template_name = "view-unfold1.html"

    def get_context_data(self, **kwargs):

        page = Page(self.request)

        pres_view = PresView(page = page)

        context = super(PresViewView, self).get_context_data(**kwargs)

        #context['ALL_STATIC'] = "all_static"
        context['unfold1_main'] = pres_view.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('PresView', self.request)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        prelude_env = page.prelude_env()
        context.update(prelude_env)

        return context

def json_me(config_file,type):
    json_answer = ''
    for ligne in config_file:
        if not ligne.startswith('#'):
            args = ligne.split(';')
            json_answer += str('{ "name": "' + args[0] + '" ,"id":"' + args[1]  + '" ,"descriptif":"' + args[2]+'"')
            if type!="dynamic":
                json_answer += str(',"contraints":')
                if args[3]=="":
                    json_answer += str('""')
                else:
                    json_answer += str(args[3])
            json_answer += str('},')
    return json_answer[:-1]


DIR = '/var/myslice/'
STATIC = '%s/config_method_static' % DIR
DYNAMIC = '%s/config_method_dynamic' % DIR
ANIMATION = '%s/config_method_animation' % DIR

def pres_view_methods(request, type):

    if type ==None:
        return 0
    elif type =="static":
        config = open(STATIC, "r")
        json_answer = str('{ "options": [')
        json_answer += str(json_me(config,"static"))
        json_answer += str('] }')
        config.close()
    elif type =="dynamic":
        config = open(DYNAMIC, "r")
        json_answer = str('{ "options": [')
        json_answer += str(json_me(config,"dynamic"))
        json_answer += str('] }')
        config.close()
    elif type =="animation":
        config = open(ANIMATION, "r")
        json_answer = str('{ "options": [')
        json_answer += str(json_me(config,"animation"))
        json_answer += str('] }')
        config.close()
    elif type =="all":
        config = open(STATIC, "r")
        json_answer = str('{ "static": [')
        json_answer += str(json_me(config,"static"))
        json_answer += str('],')
        json_answer += str('"dynamic": [')
        config.close()
        config = open(DYNAMIC, "r")
        json_answer += str(json_me(config,"dynamic"))
        json_answer += str('],')
        json_answer += str('"animation": [')
        config.close()
        config = open(ANIMATION, "r")
        json_answer += str(json_me(config,"animation"))
        json_answer += str('] }')
        config.close()
    else:
        return 0
    return HttpResponse (json_answer, mimetype="application/json")

def pres_view_animation(request, constraints, id):

# sites crees depuis 2008
# static.py?contraints=']date_created':1262325600&id='name_id"'

    # method = request.getvalue('method') #ex : GetSites
    #constraints = "']date_created':1262325600"
    #id = "2"

    if id == None:
        return 0

    # method = 'GetSites'#request.getvalue('method') #ex : GetSites
    # constraints = {}#request.getvalue('constraints') // nul = {}
    # response_field = "'site_id','name','date_created'"#request.getvalue('response_field')

    config_file = open(ANIMATION, "r")
    for ligne in config_file:
        if not ligne.startswith('#'):
            ligne = ligne.split('\n')
            first = ligne[0].split(';')
            if (str(first[1]) == str(id)):
                save = first
    config_file.close()

    #Les print_method, print_option sont definis par le client (js)
    #Les animations acceptent que les connexions anonymous
    # args = "postmsg;animation;;;anonymous;https://www.planet-lab.eu/PLCAPI/;"
    args = ";;"+str(save[8])+";"+str(save[9])+";anonymous;"+str(save[5])+";"+str(save[6])+";{"+str(constraints)+"};"+str(save[7])+";"


    #Creation d'un objet event
    event = Event(args)
    cmd = [{"params": {
            "data": {
                "print_options": event.print_options,
                "print_method": event.print_method,
                "message": event.data
            }
        }
    }]

    json_answer = json.dumps(cmd)
    return HttpResponse (json_answer, mimetype="application/json")

def pres_view_static(request, constraints, id):
    #constraints = "']date_created':1262325600"
    #id = "2"

    # method = 'GetSites'#request.getvalue('method') #ex : GetSites
    # constraints = {}#request.getvalue('constraints') // nul = {}
    # response_field = "'site_id','name','date_created'"#request.getvalue('response_field')

    config_file = open(STATIC, "r")
    for ligne in config_file:
        if not ligne.startswith('#'):
            ligne = ligne.split('\n')
            first = ligne[0].split(';')
            if (str(first[1]) == str(id)):
                save = first
    config_file.close()

    #Les print_method, print_option sont definis par le client (js)
    #Les animations acceptent que les connexions anonymous
    # args = "postmsg;animation;;;anonymous;https://www.planet-lab.eu/PLCAPI/;"
    args = ";;"+str(save[8])+";"+str(save[9])+";anonymous;"+str(save[5])+";"+str(save[6])+";{"+str(constraints)+"};"+str(save[7])+";"


    #Creation d'un objet event
    event = Event(args)
    cmd = [{"params": {
            "data": {
                "print_options": event.print_options,
                "print_method": event.print_method,
                "message": event.data
            }
        }
    }]

    json_answer = json.dumps(cmd)
    return HttpResponse (json_answer, mimetype="application/json")

class ValidatePendingView(TemplateView):
    template_name = "validate_pending.html"

    def get_context_data(self, **kwargs):
        # We might have slices on different registries with different user accounts 
        # We note that this portal could be specific to a given registry, to which we register users, but i'm not sure that simplifies things
        # Different registries mean different identities, unless we identify via SFA HRN or have associated the user email to a single hrn

        #messages.info(self.request, 'You have logged in')
        page = Page(self.request)

        ctx_my_authorities = {}
        ctx_delegation_authorities = {}


        # The user need to be logged in
        if the_user(self.request):
            # Who can a PI validate:
            # His own authorities + those he has credentials for.
            # In MySlice we need to look at credentials also.
            

            # XXX This will have to be asynchroneous. Need to implement barriers,
            # for now it will be sufficient to have it working statically

            # get user_id to later on query accounts
            # XXX Having real query plan on local tables would simplify all this
            # XXX $user_email is still not available for local tables
            #user_query = Query().get('local:user').filter_by('email', '==', '$user_email').select('user_id')
            user_query = Query().get('local:user').filter_by('email', '==', the_user(self.request)).select('user_id')
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

            # We can check on which the user has authoritity credentials = PI rights
            credential_authorities = set()
            credential_authorities_expired = set()

            # User account on these registries
            user_accounts_query = Query.get('local:account').filter_by('user_id', '==', user_id).filter_by('platform_id', 'included', platform_ids).select('config')
            user_accounts = execute_query(self.request, user_accounts_query)
            #print "=" * 80
            #print user_accounts
            #print "=" * 80
            for user_account in user_accounts:
                config = json.loads(user_account['config'])
                creds = []
                if 'authority_credentials' in config:
                    for authority_hrn, credential in config['authority_credentials'].items():
                        #if credential is not expired:
                        credential_authorities.add(authority_hrn)
                        #else
                        #    credential_authorities_expired.add(authority_hrn)
                if 'delegated_authority_credentials' in config:
                    for authority_hrn, credential in config['delegated_authority_credentials'].items():
                        #if credential is not expired:
                        credential_authorities.add(authority_hrn)
                        #else
                        #    credential_authorities_expired.add(authority_hrn)

            print 'credential_authorities =', credential_authorities
            print 'credential_authorities_expired =', credential_authorities_expired

            # ** Where am I a PI **
            # For this we need to ask SFA (of all authorities) = PI function
            pi_authorities_query = Query.get('user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')
            pi_authorities_tmp = execute_query(self.request, pi_authorities_query)
            pi_authorities = set()
            for pa in pi_authorities_tmp:
                pi_authorities |= set(pa['pi_authorities'])

            print "pi_authorities =", pi_authorities
            
            # My authorities + I have a credential
            pi_credential_authorities = pi_authorities & credential_authorities
            pi_no_credential_authorities = pi_authorities - credential_authorities - credential_authorities_expired
            pi_expired_credential_authorities = pi_authorities & credential_authorities_expired
            # Authorities I've been delegated PI rights
            pi_delegation_credential_authorities = credential_authorities - pi_authorities
            pi_delegation_expired_authorities = credential_authorities_expired - pi_authorities

            print "pi_credential_authorities =", pi_credential_authorities
            print "pi_no_credential_authorities =", pi_no_credential_authorities
            print "pi_expired_credential_authorities =", pi_expired_credential_authorities
            print "pi_delegation_credential_authorities = ", pi_delegation_credential_authorities
            print "pi_delegation_expired_authorities = ", pi_delegation_expired_authorities

            # Summary intermediary
            pi_my_authorities = pi_credential_authorities | pi_no_credential_authorities | pi_expired_credential_authorities
            pi_delegation_authorities = pi_delegation_credential_authorities | pi_delegation_expired_authorities

            print "--"
            print "pi_my_authorities = ", pi_my_authorities
            print "pi_delegation_authorities = ", pi_delegation_authorities

            # Summary all
            queried_pending_authorities = pi_my_authorities | pi_delegation_authorities
            print "----"
            print "queried_pending_authorities = ", queried_pending_authorities

            requests = get_request_by_authority(queried_pending_authorities)
            for request in requests:
                auth_hrn = request['authority_hrn']

                if auth_hrn in pi_my_authorities:
                    dest = ctx_my_authorities

                    # define the css class
                    if auth_hrn in pi_credential_authorities:
                        request['allowed'] = 'allowed'
                    elif auth_hrn in pi_expired_credential_authorities:
                        request['allowed'] = 'expired'
                    else: # pi_no_credential_authorities
                        request['allowed'] = 'denied'

                elif auth_hrn in pi_delegation_authorities:
                    dest = ctx_delegation_authorities

                    if auth_hrn in pi_delegation_credential_authorities:
                        request['allowed'] = 'allowed'
                    else: # pi_delegation_expired_authorities
                        request['allowed'] = 'expired'

                else:
                    continue

                if not auth_hrn in dest:
                    dest[auth_hrn] = []
                dest[auth_hrn].append(request) 
        
        context = super(ValidatePendingView, self).get_context_data(**kwargs)
        context['my_authorities']   = ctx_my_authorities
        context['delegation_authorities'] = ctx_delegation_authorities

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        # XXX We need to prepare the page for queries
        #context.update(page.prelude_env())

        return context
