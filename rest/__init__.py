from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_query

from django.http                    import HttpResponse


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
    
class ObjectRequest(object):
    
    def __init__(self, request, object_type, object_name):
        self.type = object_type
        self.name = object_name
        self.fields = []
        self.filters = {}
        self.options = None

        self.request = request
        
        if ((self.type == 'platform') or (self.type == 'testbed')) :
            self.type = 'local:platform'
            self.id = 'platform'
            self.fields = ['platform', 'platform_longname', 'platform_url', 'platform_description','gateway_type'];
            self.filters['disabled'] = '0'
            self.filters['gateway_type'] = 'sfa'
            self.filters['platform'] = '!myslice'
        else :
            self.setKey()
        
            self.setLocalFields()
        
    
    def setKey(self):
        print self.type
        # What about key formed of multiple fields???
        query = Query.get('local:object').filter_by('table', '==', self.type).select('key')
        results = execute_query(self.request, query)
        print "key of object = %s" % results
        if results :
            for r in results[0]['key'] :
                self.id = r
        else :
            raise Exception, 'Manifold db error'
    
    def setLocalFields(self):
        query = Query.get('local:object').filter_by('table', '==', self.type).select('column.name')
        results = execute_query(self.request, query)
        if results :
            for r in results[0]['column'] :
                self.fields.append(r['name'])
        else :
            raise Exception, 'Manifold db error'
    
    def setFields(self, fields):
        selected_fields = []
        for p in fields :
            if p in self.fields :
                selected_fields.append(p)
        self.fields = selected_fields
        
        # 
        if self.id in self.fields :
            self.fields.remove(self.id)
            [self.id].extend(self.fields)
    
    def applyFilters(self, query, force_filters = False):
        if (force_filters and not self.filters) :
            raise Exception, "Filters required"
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
        return query
    
    def get(self):
        query = Query.get(self.type).select(self.fields)
        query = self.applyFilters(query)
        return execute_query(self.request, query)
    
    def update(self):
        query = Query.update(self.type)
        query = self.applyFilters(query, True)
        if self.params :
            query.set(self.params)
        else:
            raise Exception, "Params are required for update"
        return execute_query(self.request, query)
    
    def delete(self):
        query = Query.delete(self.type)
        query = self.applyFilters(query, True)
        if self.params :
            query.set(self.params)
        else:
            raise Exception, "Params are required for update"
        return execute_query(self.request, query)
    
    def json(self):
        return HttpResponse(json.dumps(self.get(), cls=DecimalEncoder, default=DateEncoder), content_type="application/json")
    
    def datatable(self):
        response = self.get()
        response_data = {}
        response_data['fields'] = self.fields
        response_data['labels'] = self.fields
        response_data['data'] = []
        response_data['total'] = len(response)
        for r in response :
            d = []
            for p in self.fields :
                d.append(r[p])
            response_data['data'].append(d)
         
        return HttpResponse(json.dumps(response_data, cls=DecimalEncoder, default=DateEncoder), content_type="application/json")

def error(msg):
    return HttpResponse(json.dumps({'error' : msg}), content_type="application/json")

def success(msg):
    return HttpResponse(json.dumps({'success' : msg}), content_type="application/json")
