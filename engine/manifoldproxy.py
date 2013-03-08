# this view is what the javascript talks to when it sends a query
# see also
# myslice/urls.py
# as well as 
# static/js/manifold-async.js

import json
# this is for django objects only
#from django.core import serializers
from django.http import HttpResponse, HttpResponseForbidden

from engine.manifoldquery import ManifoldQuery
from engine.manifoldapi import ManifoldAPI

# xxx should probably cater for
# format_in : how is the query encoded in POST
# format_out: how to serve the results
def api (request,format):
    # expecting a POST
    if request.method != 'POST':
        print "manifoldproxy.api: unexpected method %s -- exiting"%request.method
        return 
    # we only support json for now
    if format != 'json':
        print "manifoldproxy.api: unexpected format %s -- exiting"%format
        return
    # xxx actually ask the backend here
    manifold_query = ManifoldQuery()
    manifold_query.fill_from_dict(request.POST)
    manifold_api_session_auth = request.session['manifold']['auth']
    manifold_api= ManifoldAPI(auth=manifold_api_session_auth)
    # forward
    answer=manifold_api.send_manifold_query (manifold_query)
    return HttpResponse (json.dumps(answer), mimetype="application/json")

#################### 
# to enable : see CSRF_FAILURE_VIEW in settings.py
# probably we want to elaborate this one a little in real life
# at least we can display the reason in the django output (although this turns out disappointing)
failure_answer=[ "csrf_failure" ]
def csrf_failure(request, reason=""):
    print "CSRF failure with reason '%s'"%reason
    return HttpResponseForbidden (json.dumps (failure_answer), mimetype="application/json")
