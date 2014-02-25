from manifold.core.query            import Query, AnalyzedQuery

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query, AnalyzedQuery
from manifoldapi.manifoldapi        import execute_query

import json


def dispatch(request, platform_name):
    return get(request, platform_name)

def get(request, platform_name):
    
    platform_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type')
    response = execute_query(request,platform_query)
    
    q = Query.get('slice').select('slice_hrn')
    result = execute_query(request,q)
    print result
# #     
#     query = Query.get('local:object').select('table')
#     results = execute_query(request, query)
#     print results
#     
    query = Query.get('local:object').filter_by('table', '==', 'slice').select('column.name')
    results = execute_query(request, query)
    print results
    
    response_data = {}
    response_data['columns'] = [ 'platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type' ]
    response_data['labels'] = [ 'Platform', 'Name', 'Url', 'Description','Gateway Type' ]
    response_data['data'] = []
    #response_data['resources'] = { 'total' : len(r) }
    for r in response :
        response_data['data'].append([ r['platform'], r['platform_longname'], r['platform_url'], r['platform_description'], r['gateway_type'] ])
        
    return HttpResponse(json.dumps(response_data), content_type="application/json")
