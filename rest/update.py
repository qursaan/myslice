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
    
    object_filters = {}
    object_params = {}
    result = {}
    
    if request.method == 'POST':
        req_items = request.POST.items()
    elif request.method == 'GET':
        return HttpResponse(json.dumps({'error' : 'only post request is supported'}), content_type="application/json")

    query = Query.update(object_type)
    
    if object_filters :
        for k, f in object_filters.iteritems() :
            query.filter_by(k, '==', f)
    
    # DEBUG        
    print object_filters
    
    if object_params :
        query.set(object_params.iteritems())
    else :
        return HttpResponse(json.dumps({'error' : 'an error has occurred'}), content_type="application/json")
    
    # DEBUG
    print object_params
    
    #result = execute_query(request, query)
    
    # DEBUG
    print result
    
    if result :
        return HttpResponse(json.dumps({'error' : 'an error has occurred'}), content_type="application/json")
    else :
        return HttpResponse(json.dumps({'success' : 'record updated'}), content_type="application/json")
    