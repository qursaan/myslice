# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import FreeAccessView

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_query
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

        query_current_resources = Query.get('slice').select('resource').filter_by('slice_hrn','==',slicename)
        current_resources = execute_query(request, query_current_resources)

        formatted_resource_list=[]
        try:
            for resources in current_resources:
                list_res = resources['resource']
                for res in list_res:
                    split_list = res.split('+') # split the resource urn
                    if [s for s in split_list if 'ple' in s]: # search only ple resources
                        res_hrn = split_list[-1] # last element is resource hrn
                        formatted_resource_list.append(res_hrn)
        except Exception,e:
            print "Exception in slicetabexperiment.py in ple resource search %s" % e
        
        print "list of ple resource hrns"
        print formatted_resource_list

        return render_to_response(self.template, { 'theme' : self.theme,'slicename':slicename, 'ple_slicename':ple_slicename, 'username':username, 'ple_resources':formatted_resource_list }, context_instance=RequestContext(request))

