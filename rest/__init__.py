from manifold.core.query            import Query

from django.views.generic.base      import TemplateView
from django.shortcuts               import render_to_response

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query, AnalyzedQuery
from manifoldapi.manifoldapi        import execute_query

from string import join
import json


# handles serialization of datetime in json
DateEncoder = lambda obj: obj.strftime("%B %d, %Y %H:%M:%S") if isinstance(obj, datetime.datetime) else None

# handles decimal numbers serialization in json
class DecimalEncoder(json.JSONEncoder):
    def _iterencode(self, o, markers=None):
        if isinstance(o, decimal.Decimal):
            return (str(o) for o in [o])
        return super(DecimalEncoder, self)._iterencode(o, markers)

def dispatch(request, object_type, object_name):

    switch = {
         'platform' : platform,
         'slice' : slice,
         'resource' : resource,
         'user' : user
    }

    # platform is local
    if ((object_type == 'platform') or (object_type == 'testbed')) :
        object_type = 'local:platform'
        object_properties = ['platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type'];
        return switch.get('platform', error)(request, object_name, object_properties)
    else :
        query = Query.get('local:object').filter_by('table', '==', object_type).select('column.name')
        results = execute_query(request, query)
        if results :
            object_properties = []
            for r in results[0]['column'] :
                object_properties.append(r['name'])
        else :
            return error(request, object_name, {})
        return switch.get(object_type, error)(request, object_name, object_properties)

#     if request.method == 'GET':
#         return switch.get(request, object_type, object_name, object_properties)
#     elif request.method == 'POST':
#         return post(request, object_type, object_name)

def platform(request, object_name, object_properties):
    query  = Query().get('local:platform').filter_by('disabled', '==', '0').select(object_properties)
    return send(request, execute_query(request, query), object_properties)

# Add different filters possibilities [['user.user_hrn','==','$user_hrn'],['parent_authority','==','ple.upmc']]
def slice(request, object_name, object_properties):
    #query = Query().get('slice').filter_by('user.user_hrn', '==', '$user_hrn').select(object_properties)
    query = Query().get('slice').filter_by('parent_authority', '==', 'ple.upmc').select(object_properties)
    return send(request, execute_query(request, query), object_properties)

def resource(request, object_name, object_properties):
    pass

def user(request, object_name, object_properties):
    query = Query().get('user').filter_by('user_hrn', '==', '$user_hrn').select(object_properties)
    return send(request, execute_query(request, query), object_properties)

def send(request, response, object_properties):
    if request.path.split('/')[1] == 'rest' :
        response_data = response
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    elif request.path.split('/')[1] == 'table' :
        return render_to_response('table-default.html', {'data' : response, 'properties' : object_properties})
    elif request.path.split('/')[1] == 'datatable' :
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
         
        return HttpResponse(json.dumps(response_data, cls=DecimalEncoder, default=DateEncoder), content_type="application/json")

def error(request, object_name, object_properties):
    return HttpResponse(json.dumps({'error' : 'an error has occurred'}), content_type="application/json")
