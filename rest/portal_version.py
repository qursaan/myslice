from django.http                    import HttpResponse
from portal.actions import clear_user_creds

from myslice.settings import PORTAL_VERSION

import json

def dispatch(request):
    
    ret = PORTAL_VERSION.replace('\n','')
    
    return HttpResponse(json.dumps(ret), content_type="application/json")
