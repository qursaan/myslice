# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import LoginRequiredView

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_query
from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu import topmenu_items, the_user
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView
from myslice.configengine import ConfigEngine
from myslice.settings import logger

from rest.sfa_api import sfa_client

from sfa.planetlab.plxrn import hash_loginbase

import urllib2,json

class CloudView (LoginRequiredView, ThemeView):
    # parent View is portal/sliceview.py

    def get_platforms (self, request):
        username = self.request.user    
        
        pf_query = Query().get('local:platform').filter_by('disabled', '==', '0').filter_by('gateway_type', '==', 'sfa').select('platform')
        res_platforms = execute_query(request, pf_query)
        platforms = [p['platform'] for p in res_platforms]
        return platforms


    template_name = 'slice-tab-cloud.html'
    def post (self, request, slicename):
        logger.debug("---------------- POST CloudView ------------------")
        logger.debug(request.POST)

        username = self.request.user    
        platforms = self.get_platforms(request)
        cloud_platforms = ["onelab-cloud","fuseco"]
        len_platforms = len(platforms)

        #if 'action' in request.POST:
        #    if request.POST['action'] == 'add':

        #    elif request.POST['action'] == 'delete':
        #        for key,val in request.POST:
        #            if key.endswith('_vm'):
        #                request.POST['platform']
        #                
        #    elif request.POST['action'] == 'reserve':
        #    
        #    else:
        #        log.error("action %s not supported" % request.POST['action'])

        env = { 'theme' : self.theme,
                'slicename':slicename,
                'platforms':platforms,
                'cloud_platforms':cloud_platforms,
                'len_platforms': len_platforms,
                'post_values': request.POST,
                'request':self.request,
              }
        return render_to_response(self.template, env, context_instance=RequestContext(request))


    def get (self, request, slicename, state=None):
  
        username = self.request.user    
        platforms = self.get_platforms(request)
        cloud_platforms = ["onelab-cloud","fuseco"]
        len_platforms = len(platforms)
        result = sfa_client(request,'ListResources',platforms=cloud_platforms)

        # Handle errors in ListResources, example AM is down
        for key, value in result.iteritems():
            logger.debug("key in result = %s" % key)
            if 'error' in value:
                cloud_platforms.remove(key)

        env = { 'theme' : self.theme,
                'slicename':slicename, 
                'platforms':platforms,
                'result':result,
                'cloud_platforms':cloud_platforms,
                'len_platforms': len_platforms,
                'request':self.request,
              }
        return render_to_response(self.template, env, context_instance=RequestContext(request))

