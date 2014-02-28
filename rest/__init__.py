from manifold.core.query            import Query

from django.views.generic.base      import TemplateView
from django.shortcuts               import render_to_response

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_query

from string                         import join

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

class objectRequest(object):
    
    def __init__(self, request, object_type, object_name):
        self.type = object_type
        self.name = object_name
        self.properties = []
        self.filters = {}
        self.options = None
        
        self.request = request

        if ((self.type == 'platform') or (self.type == 'testbed')) :
            self.type = 'local:platform'
            self.id = 'platform'
            self.properties = ['platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type'];
            self.filters['disabled'] = '0'
            self.filters['gateway_type'] = 'sfa'
            self.filters['platform'] = '!myslice'
        else :
            self.id = 'hrn'
            query = Query.get('local:object').filter_by('table', '==', self.type).select('column.name')
            results = execute_query(self.request, query)
            if results :
                for r in results[0]['column'] :
                    self.properties.append(r['name'])
            else :
                return error('db error')
        return None
    
    def addFilters(self, properties):
        selected_properties = []
        for p in properties :
            if p in self.properties :
                selected_properties.append(p)
        self.properties = selected_properties
        self.setId()
    
    def setId(self):
        if self.id in self.properties :
            self.properties.remove(self.id)
            [self.id].extend(self.properties)
    
    def execute(self):
        query = Query.get(self.type).select(self.properties)
        if self.filters :
            for k, f in self.filters.iteritems() :
                if (f[:1] == "!") :
                    query.filter_by(k, '!=', f[1:])
                elif (f[:2] == ">=") :
                    query.filter_by(k, '>=', f[2:])
                elif (f[:1] == ">") :
                    query.filter_by(k, '>', f[1:])
                elif (f[:2] == "<=") :
                    query.filter_by(k, '<=', f[2:])
                elif (f[:1] == "<") :
                    query.filter_by(k, '<', f[1:])
                else :
                    query.filter_by(k, '==', f)
        return execute_query(self.request, query)

def dispatch(request, object_type, object_name):
    
    o = objectRequest(request, object_type, object_name)
    
    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        req_items = request.GET
    
    print req_items
    
    for el in req_items.items():
        if el[0].startswith('filters'):
            o.filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('columns'):
            o.addFilters(req_items.getlist('columns[]'))
        elif el[0].startswith('options'):
            o.options = req_items.getlist('options[]')

    response = o.execute()
    
    if request.path.split('/')[1] == 'rest' :
        response_data = response
        return HttpResponse(json.dumps(response_data, cls=DecimalEncoder, default=DateEncoder), content_type="application/json")
    elif request.path.split('/')[1] == 'table' :
        return render_to_response('table-default.html', {'data' : response, 'properties' : o.properties, 'id' : o.id, 'options' : o.options})
    elif request.path.split('/')[1] == 'datatable' :
        response_data = {}
        response_data['columns'] = o.properties
        response_data['labels'] = o.properties
        response_data['data'] = []
        response_data['total'] = len(response)
        for r in response :
            d = []
            for p in o.properties :
                d.append(r[p])
            response_data['data'].append(d)
         
        return HttpResponse(json.dumps(response_data, cls=DecimalEncoder, default=DateEncoder), content_type="application/json")

def error(msg):
    return HttpResponse(json.dumps({'error' : msg}), content_type="application/json")
