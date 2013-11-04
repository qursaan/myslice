# a set of utilities to help make the global layout consistent across views

# dropdowns are kind of ad hoc for now, and limited to one level
# [ 
# ### a regular first-level button
# {'label':...,'href':...}, 
# ### a dropdown
# { 'label': ..., 'href'=..., 'dropdown':True, 'contents': [ { 'label':.., 'href'} ] }
# , ..]

# current: the beginning of the label in the menu that you want to outline
def topmenu_items (current,request=None):
    has_user=request.user.is_authenticated()
    result=[]
    if has_user:
        result.append({'label':'Dashboard', 'href': '/portal/dashboard/'})
        result.append({'label':'Request a slice', 'href': '/portal/slice_request/'})
        result.append({'label':'Validation', 'href': '/portal/validate/'})
        dropdown = []
        dropdown.append({'label':'My Account', 'href': '/portal/account/'})
        dropdown.append({'label':'Contact Support', 'href': '/portal/contact/'})
        result.append({'label': 'More', 'href':"#", 'dropdown':True, 'contents':dropdown})
    else:
        result.append({'label':'Home', 'href': '/login'})
        # looks like this is accessible to non-logged users
        result.append({'label':'Platforms', 'href': '/portal/platforms/'})
        result.append({'label':'Register', 'href': '/portal/register/'})
        result.append({'label':'Contact Support', 'href': '/portal/contact/'})
    # mark active if the provided 'current', even if shorter, matches the beginning of d['label']
    
    if current is not None:
        current=current.lower()
        curlen=len(current)
        def mark_active(d,up=None):
            if d['label'][:curlen].lower() == current: 
                d['is_active']=True
                if up is not None: up['is_active']=True
            print 'mark_active OUT','d=',d,'up',up
        for d in result:
            mark_active(d)
            if 'dropdown' in d:
                for dd in d['contents']: mark_active(dd,d)
    return result

def the_user (request):
    "retrieves logged in user's email, or empty string"
    if not request.user.is_authenticated (): 
        return ''
    else: 
        return request.user.email
