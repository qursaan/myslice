from django.http                    import HttpResponse
import json
from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_admin_query

def dispatch(request, action):

    results = []
    error = None
    try:
        if request.method == 'POST': 
            req_items = request.POST 
        elif request.method == 'GET':
            req_items = request.GET
    
        for el in req_items.items():
            if el[0].startswith('slice_hrn'):
                slice_hrn = el[1]
            elif el[0].startswith('initscript_code'):
                initscript_code = el[1]
                
        if (action == 'get') :
            # select initscript_code from initscript where slice_hrn=='onelab.upmc.express'
            query = Query.get('initscript').filter_by('slice_hrn', '==', slice_hrn).select('initscript_code')
            results = execute_admin_query(request, query)
    
        if (action == 'update') :
            # UPDATE initscript SET initscript_code='test3' where slice_hrn=='onelab.upmc.express'
            params = {'initscript_code' : initscript_code}
            query = Query.update('initscript').filter_by('slice_hrn', '==', slice_hrn).set(params)
            results = execute_admin_query(request, query)
    
            if results[0]['initscript_code']==1:
                results[0]['initscript_code']=initscript_code
            else:
                error = "Error in update return value"
    
        if (action == 'delete') :
            # delete from initscript where slice_hrn=='onelab.upmc.express' 
            query = Query.delete('initscript').filter_by('slice_hrn', '==', slice_hrn)
            results = execute_admin_query(request, query)
    
            if results[0]['initscript_code']==1:
                results[0]['initscript_code']=""
            else:
                error = "Error in delete return value"
    except Exception, e:
        error = str(e)
        #print "Exception : ",e
    if error is not None:
        ret = { "ret" : 1, "error" : error }
    elif not results :
        ret = { "ret" : 1, "slice_hrn" : slice_hrn }
    else :
        ret = { "ret" : 0, "slice_hrn" : slice_hrn }
        ret.update(results[0])

    return HttpResponse(json.dumps(ret), content_type="application/json")
