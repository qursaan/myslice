from django.shortcuts               import render_to_response

from unfold.loginrequired           import LoginRequiredView

from rest import ObjectRequest, error

from string import join

def dispatch(request, object_type, object_name):
    
    o = ObjectRequest(request, object_type, object_name)
    
    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        req_items = request.GET

    for el in req_items.items():
        if el[0].startswith('filters'):
            o.filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('fields'):
            o.setFields(req_items.getlist('fields[]'))
        elif el[0].startswith('options'):
            o.options = req_items.getlist('options[]')

    if request.path.split('/')[1] == 'rest' :
        return o.json()
    elif request.path.split('/')[1] == 'table' :
        return render_to_response('table-default.html', {'data' : o.get(), 'fields' : o.fields, 'id' : o.id, 'options' : o.options})
    elif request.path.split('/')[1] == 'datatable' :
        return o.datatable()
