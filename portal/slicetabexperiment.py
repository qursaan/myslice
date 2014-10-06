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

from myslice.theme import ThemeView

class ExperimentView (FreeAccessView, ThemeView):
    template_name = 'slice-tab-experiment.html'

    def get (self, request, slicename, state=None):
  
        username = self.request.user    
        
        split_slicename = slicename.split('.')
        ple_slicename = split_slicename[0] + '8' + split_slicename[1] + '_' + split_slicename[2]

        return render_to_response(self.template, { 'theme' : self.theme,'slicename':slicename, 'ple_slicename':ple_slicename, 'username':username }, context_instance=RequestContext(request))

