# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import FreeAccessView

from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from theme import ThemeView

class ExperimentView (FreeAccessView, ThemeView):
    template_name = 'experimentview.html'

    def get (self, request, slicename, state=None):
        
        return render_to_response(self.template, { 'theme' : self.theme }, context_instance=RequestContext(request))

