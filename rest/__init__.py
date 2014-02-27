from manifold.core.query            import Query

from django.views.generic.base      import TemplateView
from django.shortcuts               import render_to_response

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query, AnalyzedQuery
from manifoldapi.manifoldapi        import execute_query

from string import join
import decimal
import datetime
import json

# handles serialization of datetime in json
DateEncoder = lambda obj: obj.strftime("%B %d, %Y %H:%M:%S") if isinstance(obj, datetime.datetime) else None

# support converting decimal in json
json.encoder.FLOAT_REPR = lambda o: format(o, '.2f')

# handles decimal numbers serialization in json
class DecimalEncoder(json.JSONEncoder):
    def _iterencode(self, o, markers=None):
        if isinstance(o, decimal.Decimal):
            return (str(o) for o in [o])
        return super(DecimalEncoder, self)._iterencode(o, markers)

def dispatch(request, object_type, object_name):
    
    object_properties = None
    object_filters = {}
    
    switch = {
         'platform' : platform,
         'slice' : slice,
         'resource' : resource,
         'user' : user,
         'authority' : authority,
    }
    
    if request.method == 'POST':
        req_items = request.POST.items()
    elif request.method == 'GET':
        req_items = request.GET.items()
        
    for el in req_items:
        if el[0].startswith('filters'):
            object_filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('columns'):
            object_properties = request.POST.getlist('columns[]')

    # platform is local
    if ((object_type == 'platform') or (object_type == 'testbed')) :
        object_type = 'local:platform'
        if object_properties == None :
            object_properties = ['platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type'];
        return switch.get('platform', error)(request, object_name, object_properties, object_filters)
    else :
        if object_properties == None :
            query = Query.get('local:object').filter_by('table', '==', object_type).select('column.name')
            results = execute_query(request, query)
            if results :
                object_properties = []
                for r in results[0]['column'] :
                    object_properties.append(r['name'])
            else :
                return error(request, object_name, {})
        return switch.get(object_type, error)(request, object_name, object_properties, object_filters)

def platform(request, object_name, object_properties, object_filters = None):
    query  = Query().get('local:platform').filter_by('disabled', '==', '0').filter_by('gateway_type', '==', 'sfa').filter_by('platform', '!=', 'myslice')
    if object_filters :
        for k, f in object_filters.iteritems() :
            query.filter_by(k, '==', f)
    query.select(object_properties)
    return send(request, execute_query(request, query), object_properties)

# Add different filters possibilities [['user.user_hrn','==','$user_hrn'],['parent_authority','==','ple.upmc']]
def slice(request, object_name, object_properties, object_filters = None):
    query = Query().get('slice')#.filter_by('user.user_hrn', '==', '$user_hrn')
    if object_filters :
        for k, f in object_filters.iteritems() :
            query.filter_by(k, '==', f)
    query.select(object_properties)
    return send(request, execute_query(request, query), object_properties)

def resource(request, object_name, object_properties, object_filters = None):
    query = Query().get('resource')
    if object_filters :
        for k, f in object_filters.iteritems() :
            query.filter_by(k, '==', f)
    query.select(object_properties)
    return send(request, execute_query(request, query), object_properties)

def user(request, object_name, object_properties, object_filters = None):
    query = Query().get('user')#.filter_by('user_hrn', '==', '$user_hrn')
    if object_filters :
        for k, f in object_filters.iteritems() :
            query.filter_by(k, '==', f)
    query.select(object_properties)
    return send(request, execute_query(request, query), object_properties)

def authority(request, object_name, object_properties, object_filters = None):
    query = Query().get('authority')#.filter_by('user_hrn', '==', '$user_hrn')
    if object_filters :
        for k, f in object_filters.iteritems() :
            query.filter_by(k, '==', f)
    query.select(object_properties)
    return send(request, execute_query(request, query), object_properties)

def send(request, response, object_properties):
    if request.path.split('/')[1] == 'rest' :
        response_data = response
        return HttpResponse(json.dumps(response_data, cls=DecimalEncoder, default=DateEncoder), content_type="application/json")
    elif request.path.split('/')[1] == 'table' :
        return render_to_response('table-default.html', {'data' : response, 'properties' : object_properties})
    elif request.path.split('/')[1] == 'datatable' :
        response_data = {}
        response_data['columns'] = object_properties
        response_data['labels'] = object_properties
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
