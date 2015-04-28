from django.http                import HttpResponse
from portal.actions             import clear_user_creds

from manifoldapi.manifoldapi    import execute_query
from manifold.core.query        import Query

import json

def dispatch(request, action):
    
    if (action == 'clear') :
        query = Query.update('myslice:user').filter_by('user_hrn', '==', '$user_hrn').set({'user_email':str(request.user)}).select('user_hrn')
        try:
            res = execute_query(request, query)
        except Exception, e:
            ret = { "ret" : -1, "error" : "error clearing cache: %s" % e }
            return HttpResponse(json.dumps(ret), content_type="application/json")
    
        ret = { "ret" : 1 }
    else:
        ret = { "ret" : 0, "error" : "action not supported" }
    return HttpResponse(json.dumps(ret), content_type="application/json")
