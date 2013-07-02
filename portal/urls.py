from django.conf.urls import patterns, url

#from django.forms.formsets import formset_factory
from portal.forms import RegisterUserForm, RegisterUserStep2Form
from portal.views import RegisterUserWizardView
from portal import views

named_register_forms = (
    ("step1", RegisterUserForm),
    ("step2", RegisterUserStep2Form)
)

register_wizard = RegisterUserWizardView.as_view(named_register_forms,
    url_name="register_wizard_step")

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^register/?$', views.register_user, name='register'),
    url(r"^registerwizard/(?P<step>[-\w]+)/$", register_wizard,
        name="register_wizard_step"),
    url(r"^registerwizard/$", register_wizard, name="register_wizard")
)
