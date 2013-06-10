from portal.portalpage  import PortalPage
from plugins.wizard     import Wizard
from plugins.form       import CreateForm
from plugins.raw.raw    import Raw          # XXX

from myslice.viewutils  import the_user

from django.template.loader import render_to_string
from django.template import RequestContext

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
    # STEP 1
    # If the user already exists (is logged), let's display a summary of his account details
    # Otherwise propose a form to fill in
    if the_user(request):
        # Fill a disabled form with user info
        # Please logout to register another user
        sons.append(Raw(page=p, title=STEP1_TITLE, togglable=False, html=STEP0))
    else:
        # XXX This should become local:user
        sons.append(CreateForm(page = p, title = STEP1_TITLE, togglable = False, object = 'user'))

    # STEP 2
    # If the user already exists (is logged), let's display a summary of its institution
    # Otherwise propose a form to fill in (we should base our selection on the email)
    if the_user(request):
        # Fill a disabled form with institution
        # Please logout to register another user
        sons.append(Raw(page=p, title=STEP2_TITLE, togglable=False, html="User created"))
    else:
        sons.append(CreateForm(page = p, title = STEP2_TITLE, togglable = False, object = 'institution'))

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
        start_step = 2,
    )

    p << wizard.render(request) # in portal page if possible

    return p.render()
