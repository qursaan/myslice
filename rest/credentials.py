from django.http                    import HttpResponse
from portal.actions import clear_user_creds
import json

def dispatch(request, action, object):
    
    if (action == 'clear') :
        try :
            res = clear_user_creds(request, object)
        except :
            pass
        
        if res is not None :
            ret = { "ret" : 1, "email" : res }
        else :
            ret = { "ret" : 0 }
    
    return HttpResponse(json.dumps(ret), content_type="application/json")
