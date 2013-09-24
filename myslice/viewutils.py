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
        result.append({'label':'Platforms', 'href': '/portal/platforms/'})
        result.append({'label':'Dashboard', 'href': '/portal/dashboard/'})
        # This should probably go in dashboard at some point
        dropdown = []
        dropdown.append({'label':'Request a slice', 'href': '/portal/slice_request/'})
        dropdown.append({'label':'My Account', 'href': '/portal/account/'})
        dropdown.append({'label':'Contact Support', 'href': '/portal/contact/'})
        result.append({'label': 'More', 'href':"#", 'dropdown':True, 'contents':dropdown})
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

