import json
import os.path

# this is for django objects only
#from django.core import serializers
from django.http                import HttpResponse, HttpResponseForbidden

#from manifoldapi.manifoldquery import ManifoldQuery
from manifold.core.query        import Query
from manifold.core.result_value import ResultValue
from manifoldapi                import ManifoldAPI
from manifoldresult             import ManifoldException
from manifold.util.log          import Log

from myslice.settings import config, logger

# register activity
import activity.slice

debug=False
#debug=True

# pretend the server only returns - empty lists to 'get' requests - this is to mimick 
# misconfigurations or expired credentials or similar corner case situations
debug_empty=False
#debug_empty=True

# this view is what the javascript talks to when it sends a query
# see also
# myslice/urls.py
# as well as 
# static/js/manifold.js
def proxy (request,format):
    """the view associated with /manifold/proxy/ with the query passed using POST"""
    
    # expecting a POST
    if request.method != 'POST':
        logger.error("MANIFOLDPROXY unexpected method {} -- exiting".format(request.method))
        return HttpResponse ({"ret":0}, mimetype="application/json")
    # we only support json for now
    # if needed in the future we should probably cater for
    # format_in : how is the query encoded in POST
    # format_out: how to serve the results
    if format != 'json':
        logger.error("MANIFOLDPROXY unexpected format {} -- exiting".format(format))
        return HttpResponse ({"ret":0}, mimetype="application/json")
    try:
        # translate incoming POST request into a query object
        #logger.debug("MANIFOLDPROXY request.POST {}".format(request.POST))

        manifold_query = Query()
        #manifold_query = ManifoldQuery()
        manifold_query.fill_from_POST(request.POST)
        # retrieve session for request

        # We allow some requests to use the ADMIN user account
        if (manifold_query.get_from() == 'local:user' and manifold_query.get_action() == 'create') \
                or (manifold_query.get_from() == 'local:platform' and manifold_query.get_action() == 'get'):
            admin_user, admin_password = config.manifold_admin_user_password()
            manifold_api_session_auth = {'AuthMethod': 'password', 'Username': admin_user, 'AuthString': admin_password}
        else:
            if 'manifold' in request.session:
                manifold_api_session_auth = request.session['manifold']['auth']
            else:
                return HttpResponse (json.dumps({'code':0,'value':[]}), mimetype="application/json")
                
        if debug_empty and manifold_query.action.lower()=='get':
            return HttpResponse (json.dumps({'code':0,'value':[]}), mimetype="application/json")
                
        # actually forward
        manifold_api= ManifoldAPI(auth=manifold_api_session_auth)

        # for the benefit of the python code, manifoldAPI raises an exception if something is wrong
        # however in this case we want to propagate the complete manifold result to the js world

        result = manifold_api.forward(manifold_query.to_dict())

        # XXX TEMP HACK
        if 'description' in result and result['description'] \
                and isinstance(result['description'], (tuple, list, set, frozenset)):
            result [ 'description' ] = [ ResultValue.to_html (x) for x in result['description'] ]
        
        #
        # register activity
        #
        # resource reservation
        if (manifold_query.action.lower() == 'update') :
            logger.debug(result['value'][0])
            if 'resource' in result['value'][0] :
                for resource in result['value'][0]['resource'] :
                    activity.slice.resource(request, 
                            { 
                                'slice' :           result['value'][0]['slice_hrn'], 
                                'resource' :        resource['hostname'], 
                                'resource_type' :   resource['type'],
                                'facility' :        resource['facility_name'],
                                'testbed' :         resource['testbed_name']
                            }
                    )
        
        json_answer=json.dumps(result)

        return HttpResponse (json_answer, mimetype="application/json")

    except Exception as e:
        logger.error("MANIFOLDPROXY {}".format(e))
        import traceback
        logger.error(traceback.format_exc())
        return HttpResponse ({"ret":0}, mimetype="application/json")

#################### 
# see CSRF_FAILURE_VIEW in settings.py
# the purpose of redefining this was to display the failure reason somehow
# this however turns out disappointing/not very informative
failure_answer=[ "csrf_failure" ]
def csrf_failure(request, reason=""):
    logger.error("CSRF failure with reason '{}'".format(reason))
    return HttpResponseForbidden (json.dumps (failure_answer), mimetype="application/json")
