from manifold.core.query            import Query

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query, AnalyzedQuery
from manifold.manifoldapi           import execute_query

from string import join
import json


def dispatch(request, object_type, object_name):

    switch = {
         'platform' : platform,
         'slice' : slice,
         'user' : user
    }

    # platform is local
    if (object_type == 'platform') :
        object_type = 'local:platform'
        object_properties = ['platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type'];
    else :
        query = Query.get('local:object').filter_by('table', '==', object_type).select('column.name')
        results = execute_query(request, query)
        if results :
            object_properties = []
            for r in results[0]['column'] :
                object_properties.append(r['name'])
        else :
            return error()

    return switch.get(object_type, error)(request, object_type, object_name, object_properties)

#     if request.method == 'GET':
#         return switch.get(request, object_type, object_name, object_properties)
#     elif request.method == 'POST':
#         return post(request, object_type, object_name)

def platform():
    return HttpResponse(json.dumps({'user' : 'error message'}), content_type="application/json")

def slice():
    return HttpResponse(json.dumps({'user' : 'error message'}), content_type="application/json")

def user(request, object_type, object_name, object_properties):
    query = Query().get('user').filter_by('user_hrn', '==', '$user_hrn').select(object_properties)
    #.select('slice.slice_hrn')
        
    return send(request, execute_query(request, query), object_properties)

def send(request, response, object_properties):
    if request.path.split('/')[1] == 'rest' :
        response_data = response
    else :
        response_data = {}
        response_data['columns'] = object_properties
        response_data['labels'] = object_properties
        #response_data['labels'] = [ 'Platform', 'Name', 'Url', 'Description','Gateway Type' ]
        response_data['data'] = []
        response_data['total'] = len(response)
        for r in response :
            d = []
            for p in object_properties :
                d.append(r[p])
            print d
            
            response_data['data'].append(d)
            #response_data['data'].append([ r['platform'], r['platform_longname'], r['platform_url'], r['platform_description'], r['gateway_type'] ])
         
    return HttpResponse(json.dumps(response_data), content_type="application/json")





def get(request, object_type, object_name, object_properties):
        
    query = Query().get(object_type).select(object_properties).filter_by('user_hrn', '=', '$user_hrn')
    if (object_name) :
        query = query.filter_by(object_type + '_hrn', '=', object_name)
    
    response = execute_query(request, query)
    
    response_data = {}
    response_data['columns'] = object_properties
    response_data['labels'] = object_properties
    #response_data['labels'] = [ 'Platform', 'Name', 'Url', 'Description','Gateway Type' ]
    response_data['data'] = []
    response_data['total'] = len(response)
    for r in response :
        d = []
        for p in object_properties :
            d.append(r[p])
        print d
        
        response_data['data'].append(d)
        #response_data['data'].append([ r['platform'], r['platform_longname'], r['platform_url'], r['platform_description'], r['gateway_type'] ])
         
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def post(request, object_type, object_name):
    pass

def error():
    return HttpResponse(json.dumps({'error' : 'error message'}), content_type="application/json")