from django.http        import HttpResponse
from portal.actions     import delete_local_user
import json

def dispatch(request, action):
    
    if (action == 'delete') :
        res=[]
        email = request.POST.get('email')
        if not email:
            email = request.GET.get('email')

        ret = delete_local_user(request, email)
        #if emails :
        #    for email in emails :
        #        try :
        #            clear = clear_user_creds(request, email)
        #            if clear is not None:
        #                res.append(clear)
        #        except :
        #            pass
        #
        #if not res :
        #    ret = { "ret" : 1, "emails" : emails }
        #else :
        #    ret = { "ret" : 0 }
    
    return HttpResponse(json.dumps(ret), content_type="application/json")
