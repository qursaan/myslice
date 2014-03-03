from unfold.loginrequired           import LoginRequiredView

from string import join

from rest import ObjectRequest, error, success


def dispatch(request, object_type, object_name):
    
    o = objectRequest(request, object_type, object_name)    
    
    object_filters = {}
    object_params = {}
    result = {}
    
    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        #return error('only post request is supported')
        req_items = request.GET

    for el in req_items.items():
        if el[0].startswith('filters'):
            o.filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('options'):
            o.options = req_items.getlist('options[]')

    try:
        response = o.execute()

        if response :
            return success('record deleted')
        else :
            return error('an error has occurred')
 
    except Exception, e:
        return error(str(e))

