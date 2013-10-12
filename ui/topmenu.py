# a set of utilities to help make the global layout consistent across views

# dropdowns are kind of ad hoc for now, and limited to one level
# [ 
# ### a regular first-level button
# {'label':...,'href':...}, 
# ### a dropdown
# { 'label': ..., 'href'=..., 'dropdown':True, 'contents': [ { 'label':.., 'href'} ] }
# , ..]
def topmenu_items (current,request=None):
    has_user=request.user.is_authenticated()
    result=[]
    if has_user:
        result.append({'label':'Dashboard', 'href': '/portal/dashboard/'})
        result.append({'label':'Request a slice', 'href': '/portal/slice_request/'})
        result.append({'label':'My Account', 'href': '/portal/account/'})
        result.append({'label':'Contact Support', 'href': '/portal/contact/'})
# Not really useful at this point, is it ?
# This should probably go into dashboard at some point
#        result.append({'label':'Platforms', 'href': '/portal/platforms/'})
# the code for building a dropdown instead - but somehow this is broken
#        dropdown = [ {'label':'..', 'href': '..'}, ...]
#        result.append({'label': 'More', 'href':"#", 'dropdown':True, 'contents':dropdown})
    else:
        result.append({'label':'Home', 'href': '/login'})
        # looks like this is accessible to non-logged users
        result.append({'label':'Platforms', 'href': '/portal/platforms/'})
        result.append({'label':'Register', 'href': '/portal/register/'})
        result.append({'label':'Contact Support', 'href': '/portal/contact/'})
    # mark active
    for d in result:
        if 'dropdown' in d:
            for dd in d['contents']:
                if dd['label'] == current: dd['is_active']=True
        else:
            if d['label'] == current: d['is_active']=True
    return result

def the_user (request):
    "retrieves logged in user's email, or empty string"
    if not request.user.is_authenticated (): 
        return ''
    else: 
        return request.user.email
