from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from manifold.core.query             import Query, AnalyzedQuery

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http import HttpResponse
from django.shortcuts import render

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery
from manifold.manifoldapi            import execute_query

from theme import ThemeView

class SliceView (LoginRequiredView, ThemeView):
    template_name = "slice-view.html"
    
    def get(self, request, slicename):
#         platform_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform','platform_longname','gateway_type')
#         res = execute_query(self.request,platform_query)

        
#         slicename = 'ple.upmc.myslicedemo'
#         main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
#         main_query.select(
#                 'slice_hrn',
#                 'resource.hrn', 'resource.urn', 
#                 'resource.hostname', 'resource.type', 
#                 'resource.network_hrn',
#                 'lease.urn',
#                 'user.user_hrn',
#                 #'application.measurement_point.counter'
#         )
#          
#         res = execute_query(self.request,main_query)
       
#         print res
        
#         return render(request, self.template_name, {"resources": res[0]['resource']})
        #return render(request, self.template, {"slice": slicename, "theme": self.theme})
        return render_to_response(self.template, {"slice": slicename, "theme": self.theme, "username": request.user}, context_instance=RequestContext(request))

#     def get (self, request, name='default'):
#         return HttpResponse()