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

class objectRequest(object):

    def __init__(self, request, object_type, object_name):
        self.type = object_type
        self.name = object_name
        # No params in delete    
        self.properties = []
        self.filters = {}
        self.options = None

        self.request = request

        # What about key formed of multiple fields???
        query = Query.get('local:object').filter_by('table', '==', self.type).select('key')
        results = execute_query(self.request, query)
        print "key of object = %s" % results
        if results :
            for r in results[0]['key'] :
                self.id = r
        else :
            return error('Manifold db error')

        query = Query.get('local:object').filter_by('table', '==', self.type).select('column.name')
        results = execute_query(self.request, query)
        if results :
            for r in results[0]['column'] :
                self.properties.append(r['name'])
        else :
            return error('Manifold db error')

    def setId(self):
        if self.id in self.properties :
            self.properties.remove(self.id)
            [self.id].extend(self.properties)

    def execute(self):
        query = Query.delete(self.type)
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
        else:
            raise Exception, "Filters are required for delete"
        return execute_query(self.request, query)

def dispatch(request, object_type, object_name):
    
    o = objectRequest(request, object_type, object_name)    
    
    object_filters = {}
    object_params = {}
    result = {}
    
    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        #return HttpResponse(json.dumps({'error' : 'only post request is supported'}), content_type="application/json")
        req_items = request.GET

    for el in req_items.items():
        if el[0].startswith('filters'):
            o.filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('options'):
            o.options = req_items.getlist('options[]')

    try:
        response = o.execute()

        if response :
            return HttpResponse(json.dumps({'success' : 'record deleted'}), content_type="application/json")
        else :
            return HttpResponse(json.dumps({'error' : 'an error has occurred'}), content_type="application/json")
 
    except Exception, e:
        return HttpResponse(json.dumps({'error' : str(e)}), content_type="application/json")

