# a set of utilities to help make the global layout consistent across views

def topmenu_items (current,request=None):
    has_user=request.user.is_authenticated()
    result=[]
    if has_user:
        result.append({'label':'Platforms', 'href': '/portal/platforms/'})
        result.append({ 'label':'Dashboard', 'href': '/portal/dashboard/'})
        # This should probably go in dashboard at some point
        result.append({ 'label':'Request a slice', 'href': '/portal/slice_request/'})
        result.append({'label':'My Account', 'href': '/portal/account/'})
    else:
        result.append({'label':'Home', 'href': '/login'})
        # looks like this is accessible to non-logged users
        result.append({'label':'Platforms', 'href': '/portal/platforms/'})
        result.append({ 'label':'Register', 'href': '/portal/register/'})
    result.append({'label':'Contact Support', 'href': '/portal/contact/'})
    for d in result:
        #if d['label'].lower()find(current)>=0: d['is_active']=True
        if d['label'] == current: d['is_active']=True
    if not request: return result
#    result.append (login_out_items [ has_user] )
    return result

def the_user (request):
    "This code below is broken"
    if not request.user.is_authenticated (): 
#        print 'void user!'
        return ''
    else: 
        return request.user.email

