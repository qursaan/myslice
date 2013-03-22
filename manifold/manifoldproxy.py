import json
# this is for django objects only
#from django.core import serializers
from django.http import HttpResponse, HttpResponseForbidden

from manifold.manifoldquery import ManifoldQuery
from manifold.manifoldapi import ManifoldAPI

debug=False
debug=True

# add artificial delay in s
debug_spin=0
#debug_spin=1

# turn this on if you want the fastest possible (locally cached) feedback
# beware that this is very rough though...
work_offline=False
#work_offline=True

# this view is what the javascript talks to when it sends a query
# see also
# myslice/urls.py
# as well as 
# static/js/manifold.js
def proxy (request,format):
    """the view associated with /manifold/proxy/ 
with the query passed using POST"""
    
    # expecting a POST
    if request.method != 'POST':
        print "manifoldproxy.api: unexpected method %s -- exiting"%request.method
        return 
    # we only support json for now
    # if needed in the future we should probably cater for
    # format_in : how is the query encoded in POST
    # format_out: how to serve the results
    if format != 'json':
        print "manifoldproxy.api: unexpected format %s -- exiting"%format
        return
    try:
        # translate incoming POST request into a query object
        if debug: print 'manifoldproxy.proxy: request.POST',request.POST
        manifold_query = ManifoldQuery()
        manifold_query.fill_from_POST(request.POST)
        offline_filename="latest-%s-%s.json"%(manifold_query.action,manifold_query.subject)
        # retrieve session for request
        manifold_api_session_auth = request.session['manifold']['auth']
        ### patch : return the latest one..
        if work_offline:
            # if that won't work then we'll try to update anyways
            try:
                with (file(offline_filename,"r")) as f:
                    json_answer=f.read()
                print "By-passing : using contents from %s"%offline_filename
                return HttpResponse (json_answer, mimetype="application/json")
            except:
                import traceback
                traceback.print_exc()
                print "PROCEEDING"
                pass
                
        # actually forward
        manifold_api= ManifoldAPI(auth=manifold_api_session_auth)
        if debug: print 'manifoldproxy.proxy: sending to backend', manifold_query
        answer=manifold_api.send_manifold_query (manifold_query)
        json_answer=json.dumps(answer)
        if (debug):
            with (file(offline_filename,"w")) as f:
                f.write(json_answer)
        if debug_spin:
            import time
            time.sleep(debug_spin)
        # return json-encoded answer
        return HttpResponse (json_answer, mimetype="application/json")
    except:
        import traceback
        traceback.print_exc()

#################### 
# see CSRF_FAILURE_VIEW in settings.py
# the purpose of redefining this was to display the failure reason somehow
# this however turns out disappointing/not very informative
failure_answer=[ "csrf_failure" ]
def csrf_failure(request, reason=""):
    print "CSRF failure with reason '%s'"%reason
    return HttpResponseForbidden (json.dumps (failure_answer), mimetype="application/json")
