import json
import time
import re

from django.shortcuts           import render
from django.shortcuts           import render_to_response
from django.template                    import RequestContext
from django.contrib.sites.models import Site

from unfold.page                import Page

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_admin_query, execute_query

from portal.actions             import is_pi, create_slice, create_pending_slice, clear_user_creds, authority_check_pis
#from portal.forms               import SliceRequestForm
from unfold.loginrequired       import LoginRequiredAutoLogoutView
from ui.topmenu                 import topmenu_items_live, the_user

from myslice.theme import ThemeView
from myslice.settings import logger

import activity.user
theme = ThemeView()

class ResourcesView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'resources.html'
    
    # because we inherit LoginRequiredAutoLogoutView that is implemented by redefining 'dispatch'
    # we cannot redefine dispatch here, or we'd lose LoginRequired and AutoLogout behaviours
    def post (self, request, slicename):
        return self.get_or_post (request, 'POST', slicename)

    def get (self, request, slicename):
        return self.get_or_post (request, 'GET', slicename)

    def get_or_post  (self, request, method, slicename):
        """
        """
        # Page rendering
        page = Page(request)
        page.add_js_files  ( [ "js/jquery-ui.js" ] )
        page.add_css_files ( [ "css/jquery-ui.css" ] )

        errors = []
        slice_name =''
        template_env = {
            'theme': self.theme,
            'section': "Slice request",
            'slicename': slicename,
            'request': request,
        }
        template_env.update(page.prelude_env())

        return render_to_response(self.template,template_env, context_instance=RequestContext(request))
