import json
from pprint import pprint
from manifold.manifoldapi       import execute_query
from manifold.core.query        import Query
# a set of utilities to help make the global layout consistent across views

# dropdowns are kind of ad hoc for now, and limited to one level
# [ 
# ### a regular first-level button
# {'label':...,'href':..., ['domid':.., 'disabled':...]}, 
# ### a dropdown
# { 'label': ..., 'href'=..., 'dropdown':True, 'contents': [ { 'label':.., 'href'} ] }
# , ..]

# see also templates/widget-topmenu.html for how these items are put together
# and plugins/validatebutton for how this hident button is turned on when necessary

# current: the beginning of the label in the menu that you want to outline
def topmenu_items (current,request=None):
    has_user=request.user.is_authenticated()
    result=[]
    print request.user
    if has_user:
        result.append({'label':'Dashboard', 'href': '/portal/dashboard/'})
        result.append({'label':'Request a slice', 'href': '/portal/slice_request/'})
###        # ** Where am I a PI **
###        # For this we need to ask SFA (of all authorities) = PI function
###        user_query  = Query().get('local:user').select('config','email')
###        user_details = execute_query(request, user_query)
###
###        # Required: the user must have an authority in its user.config
###        # XXX Temporary solution
###        # not always found in user_details...
###        config={}
#### Deactivated until fixed 
####        if user_details is not None:
####            for user_detail in user_details:
####                #email = user_detail['email']
####                if user_detail['config']:
####                    config = json.loads(user_detail['config'])
####            user_detail['authority'] = config.get('authority',"Unknown Authority")
####            print "topmenu: %s", (user_detail['authority'])
####            if user_detail['authority'] is not None:
####                sub_authority = user_detail['authority'].split('.')
####                root_authority = sub_authority[0]
####                pi_authorities_query = Query.get(root_authority+':user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')
####        else:
####            pi_authorities_query = Query.get('user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')
####        try:
####            pi_authorities_tmp = execute_query(request, pi_authorities_query)
####        except:
####            pi_authorities_tmp = set()
####        pi_authorities = set()
####        for pa in pi_authorities_tmp:
####            if 'pi_authorities' in pa:
####                pi_authorities |= set(pa['pi_authorities'])
####        print "pi_authorities =", pi_authorities
####        if len(pi_authorities) > 0:
####            result.append({'label':'Validation', 'href': '/portal/validate/'})
###        result.append({'label':'Validation', 'href': '/portal/validate/'})
        # always create a disabled button for validation, and let the 
        # validatebutton plugin handle that asynchroneously, based on this domid
        result.append({'label':'Validation', 'href': '/portal/validate/', 'domid':'topmenu-validation', 'disabled':True})
        dropdown = []
        dropdown.append({'label':'Platforms', 'href': '/portal/platforms/'})
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
