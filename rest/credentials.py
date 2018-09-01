from django.http                    import HttpResponse
from portal.actions import clear_user_creds
import json

def dispatch(request, action):
    
    if (action == 'clear') :
        res=[]
        emails = request.POST.getlist('emails[]')
        if not emails:
            emails = request.GET.getlist('emails[]')
        if emails :
            for email in emails :
                try :
                    clear = clear_user_creds(request, email)
                    if clear is not None:
                        res.append(clear)
                except :
                    pass
        
        if not res :
            ret = { "ret" : 1, "emails" : emails }
        else :
            ret = { "ret" : 0 }
    
    return HttpResponse(json.dumps(ret), content_type="application/json")
