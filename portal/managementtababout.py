from __future__ import print_function

# this somehow is not used anymore - should it not be ?
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.shortcuts import render

from unfold.loginrequired import FreeAccessView

from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_query
from manifoldapi.manifoldresult import ManifoldResult
from myslice.configengine import ConfigEngine

from myslice.theme import ThemeView
import json

class ManagementAboutView (FreeAccessView, ThemeView):
    template_name = 'management-tab-about.html'

    def get (self, request):
        
        authority_contacts = {}
        authority = {'authority_hrn':'fed4fire.upmc'}
        if request.user.is_authenticated(): 
            user_local_query  = Query().get('local:user').select('config').filter_by('email','==',str(self.request.user))
            user_local_details = execute_query(self.request, user_local_query)
            user_authority = json.loads(user_local_details[0]['config']).get('authority')
            print("**************________    management about  = ",user_authority)
            # XXX Should be done using Metadata
            # select column.name from local:object where table=='authority'
            authority_query = Query().get('authority').select('authority_hrn', 'name', 'address', 'enabled','description', 
                                                              'scientific', 'city', 'name', 'url', 'country', 'enabled', 'longitude', 
                                                              'tech', 'latitude', 'pi_users', 'onelab_membership', 
                                                              'postcode').filter_by('authority_hrn','==',user_authority)
            authority_details = execute_query(self.request, authority_query)
            
            if authority_details :
                authority = authority_details[0]
                if 'scientific' in authority and authority['scientific'] is not None:
                    authority_contacts['scientific'] = [ x.strip()[1:-1] for x in authority['scientific'][1:-1].split(',') ]
                if 'technical' in authority and authority['technical'] is not None:
                    authority_contacts['technical'] = [ x.strip()[1:-1] for x in authority['tech'][1:-1].split(',') ]
                if 'legal' in authority and authority['legal'] is not None:
                    authority_contacts['legal'] = [ x.strip().replace('"','') for x in authority['legal'][1:-1].split(',') ]
            else :
                authority_contacts = None
                authority = None
            
        return render_to_response(self.template, { 'theme' : self.theme, 'authority' : authority, 'authority_contacts' : authority_contacts }, context_instance=RequestContext(request))

