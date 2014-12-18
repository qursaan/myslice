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

        ple_resource_list=[]
        nitos_resource_list=[]
        nitos_paris_resource_list=[]
        iotlab_resource_list=[]
        try:
            for resources in current_resources:
                list_res = resources['resource']
                #print "list_b4"
                #print list_res
                for res in list_res:
                    split_list = res.split('+') # split the resource urn
                    #print "list_after"
                    #print split_list
                    if [s for s in split_list if 'ple' in s]: # find ple resources
                        res_hrn = split_list[-1] # last element is resource hrn
                        ple_resource_list.append(res_hrn)
                    if [s for s in split_list if 'omf:paris.fit-nitos.fr' in s]: # find nitos_paris resources
                        res_hrn = split_list[-1] # last element is resource hrn
                        nitos_paris_resource_list.append(res_hrn)
                    if [s for s in split_list if 'iotlab' in s]: # find iotlab resources
                        res_hrn = split_list[-1] # last element is resource hrn
                        iotlab_resource_list.append(res_hrn)
                    if [s for s in split_list if 'omf:nitos.indoor' in s]: # find nitos_indoor resources
                        res_hrn = split_list[-1] # last element is resource hrn
                        nitos_resource_list.append(res_hrn)
                    if [s for s in split_list if 'omf:nitos.outdoor' in s]: # find nitos_outdoor resources
                        res_hrn = split_list[-1] # last element is resource hrn
                        nitos_resource_list.append(res_hrn)


        except Exception,e:
            print "Exception in slicetabexperiment.py in ple resource search %s" % e
        
        #print "list of ple res hrns"
        #print ple_resource_list
        #print "list of nit_paris res hrns"
        #print nitos_paris_resource_list
        #print "list of iotLab res hrns"
        #print iotlab_resource_list
        #print "list of nitos res hrns"
        #print nitos_resource_list
        
        

        return render_to_response(self.template, { 'theme' : self.theme,'slicename':slicename, 'ple_slicename':ple_slicename, 'username':username, 'ple_resources':ple_resource_list, 'nitos_resources': nitos_resource_list, 'nitos_paris_resources':nitos_paris_resource_list, 'iotlab_resources':iotlab_resource_list }, context_instance=RequestContext(request))

