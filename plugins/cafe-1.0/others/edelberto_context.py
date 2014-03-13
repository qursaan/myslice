from django.core.urlresolvers import reverse
from urllib import quote

from django.conf import settings
import myslice.settings

def login_link(request):
    """
    This assumes your login link is the Shibboleth login page for your server 
    and uses the 'target' url parameter.
    """
    full_path = quote(request.get_full_path())
    #login = reverse('shibboleth:login')

    LOGIN_URL = getattr(settings, 'LOGIN_URL', None)

    login = LOGIN_URL
    ll = "%s?target=%s" % (login, full_path)
    return { 'login_link': ll }

def logout_link(request, *args):
    """
    This assumes your login link is the Shibboleth login page for your server 
    and uses the 'target' url parameter.
    e.g: https://sp-php.cafeexpresso.rnp.br/Shibboleth.sso/Login
    """
    from app_settings import LOGOUT_URL, LOGOUT_REDIRECT_URL
    #LOGOUT_REDIRECT_URL specifies a default logout page that will always be used when
    #users logout from Shibboleth.
    target = LOGOUT_REDIRECT_URL or quote(request.build_absolute_uri())
    logout = reverse('shibboleth:logout')
    ll = "%s?target=%s" % (logout, target)
    return { 'logout_link': ll }
