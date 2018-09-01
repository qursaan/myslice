from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http import HttpResponse
from django.shortcuts import render

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from myslice.theme import ThemeView
import json

class SliceUserView (LoginRequiredView, ThemeView):
    template_name = "slice-tab-users-view.html"
    
    def get(self, request, slicename):
        if request.user.is_authenticated():
           # user_query  = Query().get('user').select('user_hrn','parent_authority').filter_by('user_hrn','==','$user_hrn')
            #user_details = execute_query(self.request, user_query)
            # if sfa returns None
            #if user_details[0]['parent_authority'] is None:
                # find in local DB 
                user_query  = Query().get('local:user').select('config')
                user_details = execute_query(request, user_query)
                for user_config in user_details:
                        config = json.loads(user_config['config'])
                        config['authority'] = config.get('authority')
                        user_details[0]['parent_authority'] = config['authority']

        return render_to_response(self.template, {"slice": slicename, "user_details":user_details[0], "theme": self.theme, "username": request.user, "section":"users"}, context_instance=RequestContext(request))
