from django.views.generic.base      import TemplateView
from django.shortcuts               import render_to_response

from unfold.loginrequired           import LoginRequiredView
from django.http                    import HttpResponse

from manifold.core.query            import Query, AnalyzedQuery
from manifoldapi.manifoldapi        import execute_query

from rest import ObjectRequest, error, success

from string import join

import json


def dispatch(request, object_type, object_name):
    
    o = ObjectRequest(request, object_type, object_name)    
    
    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        #return error('only post request is supported')
        req_items = request.GET
    print req_items
    for el in req_items.items():
        # Filters not used for create
        if el[0].startswith('filters'):
            o.filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('params'):
            o.params[el[0][7:-1]] = el[1]
        elif el[0].startswith('fields'):
            o.fields=req_items.getlist('fields[]')
        elif el[0].startswith('options'):
            o.options = req_items.getlist('options[]')

    try:
        response = o.create()

        if response :
            return success('record created')
        else :
            return error('an error has occurred')
 
    except Exception, e:
        return error(str(e))

