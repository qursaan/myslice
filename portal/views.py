#-*- coding: utf-8 -*-

from portal.portalpage  import PortalPage
from plugins.wizard     import Wizard
from plugins.form       import CreateForm
from plugins.raw.raw    import Raw          # XXX

from myslice.viewutils  import the_user

from django.template.loader import render_to_string
from django.template import RequestContext
from django.views import generic
from django.shortcuts import render

from portal.forms  import RegisterUserForm

from django.contrib.formtools.wizard.views import NamedUrlSessionWizardView
#from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage

#class MerlinWizard(NamedUrlSessionWizardView):
#
#    ...
#    ...
#
#    @classonlymethod
#    def as_view(cls, *args, **kwargs):
#        kwargs.update({
#            'form_list': [
#                NameForm,
#                QuestForm,
#                ColorForm,
#            ],
#            'url_name': 'merlin_wizard'
#        })
#        return super(MerlinWizard, cls).as_view(*args, **kwargs)

class RegisterUserWizardView(NamedUrlSessionWizardView):
#class RegisterUserWizardView(LoginRequiredMixin, NamedUrlSessionWizardView):
    # Notice that I specify a file storage instance. If you don't specify this,
    # and you need to support FileField or ImageField in your forms, you'll get
    # errors from Django. This is something else I think could be handled by
    # the views better. Seems to me that it should just use whatever the
    # default/specified storage is for the rest of your project/application.
    file_storage = default_storage # FileSystemStorage()
    template_name = "register_user_wizard.html"

    def done(self, form_list, **kwargs):
        step1_form = form_list[0]
        step2_form = form_list[1]

        productext = self.create_product(product_form)
        shippings = self.create_shippings(productext, shipping_forms)
        images = self.create_images(productext, image_forms)

        if all([productext, shippings, images]):
            del self.request.session["wizard_product_wizard_view"]

            messages.success(self.request,
                _("Your product has been created."))
            return HttpResponseRedirect(self.get_success_url(productext))

        messages.error(self.request, _("Something went wrong creating your "
            "product. Please try again or contact support."))
        return HttpResponseRedirect(reverse("register_wizard"))

    #def get_form_kwargs(self, step):
    #    if step == "product":
    #        return {"user": self.request.user}
    #    return {}

# The portal should hook the slice and user creation pages

def register_user(request):
    
    if request.method == 'POST':
        form = RegisterUserForm(request.POST) # Nous reprenons les données
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name  = form.cleaned_data['last_name']
            email      = form.cleaned_data['email']
            password   = form.cleaned_data['password']
            password2  = form.cleaned_data['password2']
            keypair    = form.cleaned_data['keypair']
            ## Ici nous pouvons traiter les données du formulaire
            #sujet = form.cleaned_data['sujet']
            #message = form.cleaned_data['message']
            #envoyeur = form.cleaned_data['envoyeur']
            #renvoi = form.cleaned_data['renvoi']
            ## Nous pourrions ici envoyer l'e-mail grâce aux données que nous venons de récupérer
            #envoi = True
    else:
        form = RegisterUserForm()
    return render(request, 'register_user.html', locals())

def index(request):

    WIZARD_TITLE = 'User registration'
    STEP1_TITLE  = 'Enter your details'
    STEP2_TITLE  = 'Select your institution'
    STEP3_TITLE  = 'Authentication'
    STEP4_TITLE  = 'Request a slice (optional)'
    STEP5_TITLE  = 'Waiting for validation'
    STEP6_TITLE  = 'Account validated'

    STEP0 = render_to_string('account_validated.html', context_instance=RequestContext(request))
    STEP2_HTML   = """
    coucou
    """
    STEP4 = """
    mede
    """
    STEP5 = render_to_string('account_validated.html', context_instance=RequestContext(request))

    p = PortalPage(request)

    # This is redundant with the Wizard title
    p << "<h3>User registration</h3>"

    sons = []
    start_step = 1

    # STEP 1
    # If the user already exists (is logged), let's display a summary of his account details
    # Otherwise propose a form to fill in
    if the_user(request):
        # Fill a disabled form with user info
        # Please logout to register another user
        sons.append(Raw(page=p, title=STEP1_TITLE, togglable=False, html=STEP0))
        start_step += 1
    else:
        # We could pass a list of fields also, instead of retrieving them from metadata
        # Otherwise we need some heuristics to display nice forms
        # XXX Could we log the user in after the form is validated ?
        # XXX Explain the password is for XXX
        field_list = [{
            'name'        : 'First name',
            'field'       : 'firstname',
            'type'        : 'text',
            'validate_rx' : '^[a-zA-Z -]+$',
            'validate_err': 'Your first name must be comprised of letters only',
            'description' : 'Enter your first name',
        }, {
            'name'        : 'Last name',
            'field'       : 'lastname',
            'type'        : 'text',
            'validate_rx' : '^[a-zA-Z -]+$',
            'validate_err': 'Your last name must be comprised of letters only',
            'description' : 'Enter your last name',
        }, { 
            'name'        : 'Email',
            'field'       : 'email',
            'type'        : 'text',
            'description' : 'Enter your email address',
        }, {
            'name'        : 'Password',
            'field'       : 'password',
            'type'        : 'password',
            'description' : 'Enter your password',
        }, {
            'name'        : 'Confirm password',
            'field'       : 'password2',
            'type'        : 'password',
            'description' : 'Enter your password again',
        }]
        sons.append(CreateForm(page = p, title = STEP1_TITLE, togglable = False, object = 'local:user', fields = field_list))

    # STEP 2
    # If the user already exists (is logged), let's display a summary of its institution
    # Otherwise propose a form to fill in (we should base our selection on the email)
    if the_user(request):
        # Fill a disabled form with institution
        # Please logout to register another user
        sons.append(Raw(page=p, title=STEP2_TITLE, togglable=False, html="User created"))
        start_step += 1
    else:
        sons.append(CreateForm(page = p, title = STEP2_TITLE, togglable = False, object = 'slice')) #institution'))

    # STEP3
    # Please should your prefered authentication method
    # This step should allow the user to either choose the user or managed mode in MySlice
    sons.append(Raw(page = p, title = STEP3_TITLE, togglable = False, html = STEP2_HTML))

    # Step 4: Request a slice (optional)
    sons.append(CreateForm(page = p, title = STEP4_TITLE, togglable = False, object = 'slice'))

    # Step 5: Your request is waiting for validation
    # Periodic refresh
    sons.append(Raw(page = p, title = STEP5_TITLE, togglable = False, html = STEP4))

    # Step 6: Account validation  = welcome for newly validated users
    # . delegation
    # . platforms
    # . slice
    # . pointers
    sons.append(Raw(page = p, title = STEP6_TITLE, togglable = False, html = STEP5))

    wizard = Wizard(
        page       = p,
        title      = WIZARD_TITLE,
        togglable  = False,
        sons       = sons,
        start_step = start_step,
    )

    p << wizard.render(request) # in portal page if possible

    return p.render()
