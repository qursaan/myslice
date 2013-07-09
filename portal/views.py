# -*- coding: utf-8 -*-
#
# portal/views.py: views for the portal application
# This file is part of the Manifold project.
#
# Authors:
#   Jordan Augé <jordan.auge@lip6.fr>
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

from django.conf                 import settings
from django.contrib.sites.models import Site, RequestSite
from django.contrib import messages
from django.views.generic        import View
from django.views.generic.base   import TemplateView
from django.shortcuts            import render
from plugins.lists.simplelist    import SimpleList
from portal                      import signals
from portal.forms                import UserRegisterForm, SliceRequestForm
from portal.util                 import RegistrationView, ActivationView
from portal.models               import PendingUser, PendingSlice
from manifold.core.query         import Query
from unfold.page                 import Page
from myslice.viewutils           import topmenu_items, the_user

class DashboardView(TemplateView):
    template_name = "dashboard.html"

    def get_context_data(self, **kwargs):
        user_hrn = 'ple.upmc.jordan_auge'

        messages.info(self.request, 'You have logged in')


        page = Page(self.request)

        # Slow...
        #slice_query = Query().get('slice').filter_by('user.user_hrn', 'contains', user_hrn).select('slice_hrn')
        slice_query = Query().get('user').filter_by('user_hrn', '==', user_hrn).select('slice.slice_hrn')
        auth_query  = Query().get('network').select('network_hrn')
        page.enqueue_query(slice_query)
        page.enqueue_query(auth_query)

        page.expose_queries()

        slicelist = SimpleList(
            title = None,
            page  = page,
            key   = 'slice.slice_hrn',
            query = slice_query,
        )
         
        authlist = SimpleList(
            title = None,
            page  = page,
            key   = 'network_hrn',
            query = auth_query,
        )

        context = super(DashboardView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['networks'] = authlist.render(self.request) 
        context['slices']   = slicelist.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Test view that combines various plugins'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        context.update(page.prelude_env())

        return context

class UserRegisterView(RegistrationView):
    """
    A registration backend which follows a simple workflow:

    1. User signs up, inactive account is created.

    2. Email is sent to user with activation link.

    3. User clicks activation link, account is now active.

    Using this backend requires that

    * ``registration`` be listed in the ``INSTALLED_APPS`` setting
      (since this backend makes use of models defined in this
      application).

    * The setting ``ACCOUNT_ACTIVATION_DAYS`` be supplied, specifying
      (as an integer) the number of days from registration during
      which a user may activate their account (after that period
      expires, activation will be disallowed).

    * The creation of the templates
      ``registration/activation_email_subject.txt`` and
      ``registration/activation_email.txt``, which will be used for
      the activation email. See the notes for this backends
      ``register`` method for details regarding these templates.

    Additionally, registration can be temporarily closed by adding the
    setting ``REGISTRATION_OPEN`` and setting it to
    ``False``. Omitting this setting, or setting it to ``True``, will
    be interpreted as meaning that registration is currently open and
    permitted.

    Internally, this is accomplished via storing an activation key in
    an instance of ``registration.models.RegistrationProfile``. See
    that model and its custom manager for full documentation of its
    fields and supported operations.
    
    """
    form_class = UserRegisterForm
    
    def register(self, request, **cleaned_data):
        """
        Given a username, email address and password, register a new
        user account, which will initially be inactive.

        Along with the new ``User`` object, a new
        ``registration.models.RegistrationProfile`` will be created,
        tied to that ``User``, containing the activation key which
        will be used for this account.

        An email will be sent to the supplied email address; this
        email should contain an activation link. The email will be
        rendered using two templates. See the documentation for
        ``RegistrationProfile.send_activation_email()`` for
        information about these templates and the contexts provided to
        them.

        After the ``User`` and ``RegistrationProfile`` are created and
        the activation email is sent, the signal
        ``registration.signals.user_registered`` will be sent, with
        the new ``User`` as the keyword argument ``user`` and the
        class of this backend as the sender.

        """
        first_name = cleaned_data['first_name']
        last_name  = cleaned_data['last_name']
        email      = cleaned_data['email']
        password   = cleaned_data['password1']
        #password2  = cleaned_data['password2']
        keypair    = cleaned_data['keypair']

        #if Site._meta.installed:
        #    site = Site.objects.get_current()
        #else:
        #    site = RequestSite(request) 
        site = None

        new_user = PendingUser.objects.create_inactive_user(first_name, last_name, email, password, site)
        signals.user_registered.send(sender=self.__class__,
                                     user=new_user,
                                     request=request)
        return new_user

    def registration_allowed(self, request):
        """
        Indicate whether account registration is currently permitted,
        based on the value of the setting ``REGISTRATION_OPEN``. This
        is determined as follows:

        * If ``REGISTRATION_OPEN`` is not specified in settings, or is
          set to ``True``, registration is permitted.

        * If ``REGISTRATION_OPEN`` is both specified and set to
          ``False``, registration is not permitted.
        
        """
        return getattr(settings, 'REGISTRATION_OPEN', True)

    def get_success_url(self, request, user):
        """
        Return the name of the URL to redirect to after successful
        user registration.
        
        """
        return ('user_register_complete', (), {})


class UserValidateView(ActivationView):
    def activate(self, request, activation_key):
        """
        Given an an activation key, look up and activate the user
        account corresponding to that key (if possible).

        After successful activation, the signal
        ``registration.signals.user_activated`` will be sent, with the
        newly activated ``User`` as the keyword argument ``user`` and
        the class of this backend as the sender.
        
        """
        activated_user = RegistrationProfile.objects.activate_user(activation_key)
        if activated_user:
            signals.user_activated.send(sender=self.__class__,
                                        user=activated_user,
                                        request=request)
        return activated_user

    def get_success_url(self, request, user):
        return ('registration_activation_complete', (), {})


# DEPRECATED #from portal.portalpage  import PortalPage
# DEPRECATED #from plugins.wizard     import Wizard
# DEPRECATED #from plugins.form       import CreateForm
# DEPRECATED #from plugins.raw.raw    import Raw          # XXX
# DEPRECATED #
# DEPRECATED #from myslice.viewutils  import the_user
# DEPRECATED #
# DEPRECATED #from django.template.loader import render_to_string
# DEPRECATED #from django.template import RequestContext
# DEPRECATED #from django.views import generic
# DEPRECATED #
# DEPRECATED #from django.contrib.formtools.wizard.views import NamedUrlSessionWizardView
# DEPRECATED ##from django.core.files.storage import FileSystemStorage
# DEPRECATED #from django.core.files.storage import default_storage
# DEPRECATED #
# DEPRECATED ##class MerlinWizard(NamedUrlSessionWizardView):
# DEPRECATED ##
# DEPRECATED ##    ...
# DEPRECATED ##    ...
# DEPRECATED ##
# DEPRECATED ##    @classonlymethod
# DEPRECATED ##    def as_view(cls, *args, **kwargs):
# DEPRECATED ##        kwargs.update({
# DEPRECATED ##            'form_list': [
# DEPRECATED ##                NameForm,
# DEPRECATED ##                QuestForm,
# DEPRECATED ##                ColorForm,
# DEPRECATED ##            ],
# DEPRECATED ##            'url_name': 'merlin_wizard'
# DEPRECATED ##        })
# DEPRECATED ##        return super(MerlinWizard, cls).as_view(*args, **kwargs)
# DEPRECATED #
# DEPRECATED #class UserRegisterWizardView(NamedUrlSessionWizardView):
# DEPRECATED ##class UserRegisterWizardView(LoginRequiredMixin, NamedUrlSessionWizardView):
# DEPRECATED #    # Notice that I specify a file storage instance. If you don't specify this,
# DEPRECATED #    # and you need to support FileField or ImageField in your forms, you'll get
# DEPRECATED #    # errors from Django. This is something else I think could be handled by
# DEPRECATED #    # the views better. Seems to me that it should just use whatever the
# DEPRECATED #    # default/specified storage is for the rest of your project/application.
# DEPRECATED #    file_storage = default_storage # FileSystemStorage()
# DEPRECATED #    template_name = "register_user_wizard.html"
# DEPRECATED #
# DEPRECATED #    def done(self, form_list, **kwargs):
# DEPRECATED #        step1_form = form_list[0]
# DEPRECATED #        step2_form = form_list[1]
# DEPRECATED #
# DEPRECATED #        productext = self.create_product(product_form)
# DEPRECATED #        shippings = self.create_shippings(productext, shipping_forms)
# DEPRECATED #        images = self.create_images(productext, image_forms)
# DEPRECATED #
# DEPRECATED #        if all([productext, shippings, images]):
# DEPRECATED #            del self.request.session["wizard_product_wizard_view"]
# DEPRECATED #
# DEPRECATED #            messages.success(self.request,
# DEPRECATED #                _("Your product has been created."))
# DEPRECATED #            return HttpResponseRedirect(self.get_success_url(productext))
# DEPRECATED #
# DEPRECATED #        messages.error(self.request, _("Something went wrong creating your "
# DEPRECATED #            "product. Please try again or contact support."))
# DEPRECATED #        return HttpResponseRedirect(reverse("register_wizard"))
# DEPRECATED #
# DEPRECATED #    #def get_form_kwargs(self, step):
# DEPRECATED #    #    if step == "product":
# DEPRECATED #    #        return {"user": self.request.user}
# DEPRECATED #    #    return {}
# DEPRECATED #
# DEPRECATED ## The portal should hook the slice and user creation pages
# DEPRECATED #
# DEPRECATED #def register_user(request):
# DEPRECATED #    
# DEPRECATED #    if request.method == 'POST':
# DEPRECATED #        form = UserRegisterForm(request.POST) # Nous reprenons les données
# DEPRECATED #        if form.is_valid():
# DEPRECATED #            first_name = form.cleaned_data['first_name']
# DEPRECATED #            last_name  = form.cleaned_data['last_name']
# DEPRECATED #            email      = form.cleaned_data['email']
# DEPRECATED #            password   = form.cleaned_data['password']
# DEPRECATED #            password2  = form.cleaned_data['password2']
# DEPRECATED #            keypair    = form.cleaned_data['keypair']
# DEPRECATED #            ## Ici nous pouvons traiter les données du formulaire
# DEPRECATED #            #sujet = form.cleaned_data['sujet']
# DEPRECATED #            #message = form.cleaned_data['message']
# DEPRECATED #            #envoyeur = form.cleaned_data['envoyeur']
# DEPRECATED #            #renvoi = form.cleaned_data['renvoi']
# DEPRECATED #            ## Nous pourrions ici envoyer l'e-mail grâce aux données que nous venons de récupérer
# DEPRECATED #            #envoi = True
# DEPRECATED #    else:
# DEPRECATED #        form = UserRegisterForm()
# DEPRECATED #    return render(request, 'register_user.html', locals())
# DEPRECATED #
# DEPRECATED #def index(request):
# DEPRECATED #
# DEPRECATED #    WIZARD_TITLE = 'User registration'
# DEPRECATED #    STEP1_TITLE  = 'Enter your details'
# DEPRECATED #    STEP2_TITLE  = 'Select your institution'
# DEPRECATED #    STEP3_TITLE  = 'Authentication'
# DEPRECATED #    STEP4_TITLE  = 'Request a slice (optional)'
# DEPRECATED #    STEP5_TITLE  = 'Waiting for validation'
# DEPRECATED #    STEP6_TITLE  = 'Account validated'
# DEPRECATED #
# DEPRECATED #    STEP0 = render_to_string('account_validated.html', context_instance=RequestContext(request))
# DEPRECATED #    STEP2_HTML   = """
# DEPRECATED #    coucou
# DEPRECATED #    """
# DEPRECATED #    STEP4 = """
# DEPRECATED #    mede
# DEPRECATED #    """
# DEPRECATED #    STEP5 = render_to_string('account_validated.html', context_instance=RequestContext(request))
# DEPRECATED #
# DEPRECATED #    p = PortalPage(request)
# DEPRECATED #
# DEPRECATED #    # This is redundant with the Wizard title
# DEPRECATED #    p << "<h3>User registration</h3>"
# DEPRECATED #
# DEPRECATED #    sons = []
# DEPRECATED #    start_step = 1
# DEPRECATED #
# DEPRECATED #    # STEP 1
# DEPRECATED #    # If the user already exists (is logged), let's display a summary of his account details
# DEPRECATED #    # Otherwise propose a form to fill in
# DEPRECATED #    if the_user(request):
# DEPRECATED #        # Fill a disabled form with user info
# DEPRECATED #        # Please logout to register another user
# DEPRECATED #        sons.append(Raw(page=p, title=STEP1_TITLE, togglable=False, html=STEP0))
# DEPRECATED #        start_step += 1
# DEPRECATED #    else:
# DEPRECATED #        # We could pass a list of fields also, instead of retrieving them from metadata
# DEPRECATED #        # Otherwise we need some heuristics to display nice forms
# DEPRECATED #        # XXX Could we log the user in after the form is validated ?
# DEPRECATED #        # XXX Explain the password is for XXX
# DEPRECATED #        field_list = [{
# DEPRECATED #            'name'        : 'First name',
# DEPRECATED #            'field'       : 'firstname',
# DEPRECATED #            'type'        : 'text',
# DEPRECATED #            'validate_rx' : '^[a-zA-Z -]+$',
# DEPRECATED #            'validate_err': 'Your first name must be comprised of letters only',
# DEPRECATED #            'description' : 'Enter your first name',
# DEPRECATED #        }, {
# DEPRECATED #            'name'        : 'Last name',
# DEPRECATED #            'field'       : 'lastname',
# DEPRECATED #            'type'        : 'text',
# DEPRECATED #            'validate_rx' : '^[a-zA-Z -]+$',
# DEPRECATED #            'validate_err': 'Your last name must be comprised of letters only',
# DEPRECATED #            'description' : 'Enter your last name',
# DEPRECATED #        }, { 
# DEPRECATED #            'name'        : 'Email',
# DEPRECATED #            'field'       : 'email',
# DEPRECATED #            'type'        : 'text',
# DEPRECATED #            'description' : 'Enter your email address',
# DEPRECATED #        }, {
# DEPRECATED #            'name'        : 'Password',
# DEPRECATED #            'field'       : 'password',
# DEPRECATED #            'type'        : 'password',
# DEPRECATED #            'description' : 'Enter your password',
# DEPRECATED #        }, {
# DEPRECATED #            'name'        : 'Confirm password',
# DEPRECATED #            'field'       : 'password2',
# DEPRECATED #            'type'        : 'password',
# DEPRECATED #            'description' : 'Enter your password again',
# DEPRECATED #        }]
# DEPRECATED #        sons.append(CreateForm(page = p, title = STEP1_TITLE, togglable = False, object = 'local:user', fields = field_list))
# DEPRECATED #
# DEPRECATED #    # STEP 2
# DEPRECATED #    # If the user already exists (is logged), let's display a summary of its institution
# DEPRECATED #    # Otherwise propose a form to fill in (we should base our selection on the email)
# DEPRECATED #    if the_user(request):
# DEPRECATED #        # Fill a disabled form with institution
# DEPRECATED #        # Please logout to register another user
# DEPRECATED #        sons.append(Raw(page=p, title=STEP2_TITLE, togglable=False, html="User created"))
# DEPRECATED #        start_step += 1
# DEPRECATED #    else:
# DEPRECATED #        sons.append(CreateForm(page = p, title = STEP2_TITLE, togglable = False, object = 'slice')) #institution'))
# DEPRECATED #
# DEPRECATED #    # STEP3
# DEPRECATED #    # Please should your prefered authentication method
# DEPRECATED #    # This step should allow the user to either choose the user or managed mode in MySlice
# DEPRECATED #    sons.append(Raw(page = p, title = STEP3_TITLE, togglable = False, html = STEP2_HTML))
# DEPRECATED #
# DEPRECATED #    # Step 4: Request a slice (optional)
# DEPRECATED #    sons.append(CreateForm(page = p, title = STEP4_TITLE, togglable = False, object = 'slice'))
# DEPRECATED #
# DEPRECATED #    # Step 5: Your request is waiting for validation
# DEPRECATED #    # Periodic refresh
# DEPRECATED #    sons.append(Raw(page = p, title = STEP5_TITLE, togglable = False, html = STEP4))
# DEPRECATED #
# DEPRECATED #    # Step 6: Account validation  = welcome for newly validated users
# DEPRECATED #    # . delegation
# DEPRECATED #    # . platforms
# DEPRECATED #    # . slice
# DEPRECATED #    # . pointers
# DEPRECATED #    sons.append(Raw(page = p, title = STEP6_TITLE, togglable = False, html = STEP5))
# DEPRECATED #
# DEPRECATED #    wizard = Wizard(
# DEPRECATED #        page       = p,
# DEPRECATED #        title      = WIZARD_TITLE,
# DEPRECATED #        togglable  = False,
# DEPRECATED #        sons       = sons,
# DEPRECATED #        start_step = start_step,
# DEPRECATED #    )
# DEPRECATED #
# DEPRECATED #    p << wizard.render(request) # in portal page if possible
# DEPRECATED #
# DEPRECATED #    return p.render()
