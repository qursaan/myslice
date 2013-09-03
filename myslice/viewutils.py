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


# a decorator for view classes to catch manifold exceptions
# by design views should not directly exercise a manifold query
# given that these are asynchroneous, you would expect a view to just 
# return a mundane skeleton
# however of course this is not always true, and if only for metadata 
# that for some reason we deal with some other way, it is often a good idea
# for a view to monitor these exceptions - and to take this opportunity to 
# logout people if it's a matter of expired session for example
def logout_on_manifold_exception (view_as_a_function):
    def wrapped (request, *args, **kwds):
        try:
            return view_as_a_function(request,*args, **kwds)
        except ManifoldException, manifold_result:
            # xxx we need a means to display this message to user...
            from django.contrib.auth import logout
            logout(request)
            return HttpResponseRedirect ('/')
        except Exception, e:
            # xxx we need to sugarcoat this error message in some error template...
            print "Unexpected exception",e
            import traceback
            traceback.print_exc()
            return HttpResponseRedirect ('/')
    return wrapped

