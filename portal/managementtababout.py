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
        
        if request.user.is_authenticated(): 
            user_query  = Query().get('user').select('user_hrn','parent_authority').filter_by('user_hrn','==','$user_hrn')
            user_details = execute_query(self.request, user_query)
            
            user_local_query  = Query().get('local:user').select('config').filter_by('email','==',str(self.request.user))
            user_local_details = execute_query(self.request, user_local_query)
            user_authority = json.loads(user_local_details[0]['config']).get('authority')
            
            authority_query = Query().get('authority').select('description', 'authority_hrn', 'legal', 'address', 'abbreviated_name', 
                                                              'scientific', 'city', 'name', 'url', 'country', 'enabled', 'longitude', 
                                                              'tech', 'latitude', 'pi_users', 'parent_authority', 'onelab_membership', 
                                                              'postcode').filter_by('authority_hrn','==',user_authority)
            authority_details = execute_query(self.request, authority_query)
            
            if authority_details :
                authority_contacts = {}
                authority_contacts['scientific'] = [ x.strip()[1:-1] for x in authority_details[0]['scientific'][1:-1].split(',') ]
                authority_contacts['technical'] = [ x.strip()[1:-1] for x in authority_details[0]['tech'][1:-1].split(',') ]
            
                authority_contacts['legal'] = [ x.strip().replace('"','') for x in authority_details[0]['legal'][1:-1].split(',') ]
                authority = authority_details[0]
            else :
                authority_contacts = None
                authority = None
            
        return render_to_response(self.template, { 'theme' : self.theme, 'authority' : authority, 'authority_contacts' : authority_contacts }, context_instance=RequestContext(request))

