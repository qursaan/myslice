from manifold.core.query            import Query, AnalyzedQuery

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query, AnalyzedQuery
from manifold.manifoldapi           import execute_query

import json

def platform(request, platform_name):
    
    platform_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type')
    response = execute_query(request,platform_query)
    
    response_data = {}
    response_data['columns'] = [ 'platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type' ]
    response_data['labels'] = [ 'Platform', 'Name', 'Url', 'Description','Gateway Type' ]
    response_data['data'] = []
    for r in response :
        response_data['data'].append([ r['platform'], r['platform_longname'], r['platform_url'], r['platform_description'], r['gateway_type'] ])
        
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def slice(request, slice_name):
    
    platform_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type')
    response = execute_query(request,platform_query)
    

    
    response_data = {}
    response_data['columns'] = [ 'platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type' ]
    response_data['labels'] = [ 'Platform', 'Name', 'Url', 'Description','Gateway Type' ]
    response_data['data'] = []
    for r in response :
        response_data['data'].append([ r['platform'], r['platform_longname'], r['platform_url'], r['platform_description'], r['gateway_type'] ])
        
    return HttpResponse(json.dumps(response_data), content_type="application/json")

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
#        
#         print res
#         
#         return render(request, self.template_name, {"resources": res[0]['resource']})
    

#     def get (self, request, name='default'):
#         return HttpResponse()