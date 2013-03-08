# this view is what the javascript talks to when it sends a query
# see also
# myslice/urls.py
# as well as 
# static/js/manifold-async.js

from django.core import serializers
from django.http import HttpResponse

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
    hard_wired_answer = {'a':'some string','b':123}
    return HttpResponse (serializers.serialize("json",hard_wired_answer),
                         mimetype="application/json")
