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
from myslice.configengine import ConfigEngine
from myslice.settings import logger

from sfa.planetlab.plxrn import hash_loginbase

import urllib2,json

class ExperimentView (FreeAccessView, ThemeView):
    # parent View is portal/sliceview.py

    template_name = 'slice-tab-experiment.html'

    def get (self, request, slicename, state=None):
  
        username = self.request.user    
        
        pf_query = Query().get('local:platform').filter_by('disabled', '==', '0').filter_by('gateway_type', '==', 'sfa').select('platform')
        res_platforms = execute_query(request, pf_query)
        platforms = [p['platform'] for p in res_platforms]
        len_platforms = len(platforms)
        #query_current_resources = Query.get('slice').select('resource','parent_authority').filter_by('slice_hrn','==',slicename)
        #current_resources = execute_query(request, query_current_resources)

        #parent_authority = current_resources[0]['parent_authority']
        #
        #split_slicename = slicename.split('.')
        #ple_slicename = hash_loginbase(parent_authority) + '_' + split_slicename[-1]

        #ple_resource_list=[]
        #nitos_resource_list=[]
        #nitos_paris_resource_list=[]
        #iotlab_resource_list=[]
        #try:
        #    for resources in current_resources:
        #        list_res = resources['resource']
        #        for res in list_res:
        #            split_list = res.split('+') # split the resource urn
        #            if [s for s in split_list if 'ple' in s]: # find ple resources
        #                res_hrn = split_list[-1] # last element is resource hrn
        #                ple_resource_list.append(res_hrn)
        #            if [s for s in split_list if 'omf:paris.fit-nitos.fr' in s]: # find nitos_paris resources
        #                res_hrn = split_list[-1] # last element is resource hrn
        #                nitos_paris_resource_list.append(res_hrn)
        #            if [s for s in split_list if 'iotlab' in s]: # find iotlab resources
        #                res_hrn = split_list[-1] # last element is resource hrn
        #                iotlab_resource_list.append(res_hrn)
        #            if [s for s in split_list if 'omf:nitos.indoor' in s]: # find nitos_indoor resources
        #                res_hrn = split_list[-1] # last element is resource hrn
        #                nitos_resource_list.append(res_hrn)
        #            if [s for s in split_list if 'omf:nitos.outdoor' in s]: # find nitos_outdoor resources
        #                res_hrn = split_list[-1] # last element is resource hrn
        #                nitos_resource_list.append(res_hrn)


        #except Exception as e:
        #    logger.error("Exception in slicetabexperiment.py in OneLab resource search {}".format(e))
        #
        ##logger.debug("list of ple res hrns")
        ##logger.debug(ple_resource_list)
        ##logger.debug("list of nit_paris res hrns")
        ##logger.debug(nitos_paris_resource_list)
        ##logger.debug("list of iotLab res hrns")
        ##logger.debug(iotlab_resource_list)
        ##logger.debug("list of nitos res hrns")
        ##logger.debug(nitos_resource_list)

        #all_users = list() 
        ##get all  iotlab users
        #all_users = list() 
        #try:
        #    engine = ConfigEngine()
        #    userData = "Basic " + (engine.iotlab_admin_user() + ":" + engine.iotlab_admin_password()).encode("base64").rstrip()
        #    req = urllib2.Request(engine.iotlab_url())
        #    req.add_header('Accept', 'application/json')
        #    req.add_header("Content-type", "application/x-www-form-urlencoded")
        #    req.add_header('Authorization', userData)
        #    # make the request and print the results
        #    res = urllib2.urlopen(req)
        #    all_users = json.load(res) 
        #except urllib2.URLError as e:
        #    logger.error("There is a problem in getting iotlab users {}".format(e.reason))
       

        ##getting the login from email
        ##initial value  no-account == contact_admin
        #iot_login = 'contact_admin'
        #username = str(username)
        #for user in all_users:
        #    if user['email'] == username:
        #        iot_login = user['login']
        env = { 'theme' : self.theme,
                'slicename':slicename, 
                'platforms':platforms,
                'len_platforms': len_platforms,
                #'ple_slicename':ple_slicename, 
                #'username':username, 
                #'ple_resources':ple_resource_list, 
                #'nitos_resources': nitos_resource_list, 
                #'nitos_paris_resources':nitos_paris_resource_list, 
                #'iotlab_resources':iotlab_resource_list, 
                #'iot_login':iot_login,
                'request':self.request,
              }
        return render_to_response(self.template, env, context_instance=RequestContext(request))

