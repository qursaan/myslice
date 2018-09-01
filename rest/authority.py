from django.http                    import HttpResponse
from portal.actions                 import authority_add_pis, authority_remove_pis
import json

def dispatch(request, action):
    
    try:
        if request.method == 'POST':
            req_items = request.POST
        elif request.method == 'GET':
            req_items = request.GET

        if 'user_hrn' in req_items:
            user_hrn = str(req_items['user_hrn'])
        if 'authority_hrn' in req_items:
            authority_hrn = str(req_items['authority_hrn'])

        if (action == 'add') :
            new_pis = authority_add_pis(request, authority_hrn, user_hrn)
            result = {'ret':1}
        elif (action == 'remove'):
            new_pis = authority_remove_pis(request, authority_hrn, user_hrn)
            result = {'ret':1}
        else:
            raise Exception, "action not supported"
    except Exception as e:
        result = {'ret': -1, 'msg':'error: %s' % e}
    return HttpResponse(json.dumps(result), content_type="application/json")

