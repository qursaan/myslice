from rest import ObjectRequest, error, success

from django.views.generic.base      import TemplateView
from django.shortcuts               import render_to_response
from django.http                    import HttpResponse

from unfold.loginrequired           import LoginRequiredView

from manifold.core.query            import Query, AnalyzedQuery
from manifoldapi.manifoldapi        import execute_query

from myslice.settings import logger

def dispatch(request, object_type, object_name):
    
    o = ObjectRequest(request, object_type, object_name)    
    
    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        #return error('only post request is supported')
        req_items = request.GET
    logger.debug(req_items)
    for el in req_items.items():
        
        logger.debug("#===============> {}".format(el))
        if el[0].startswith('filters'):
            o.filters[el[0][8:-1]] = el[1]
        elif el[0].startswith('params'):
            logger.debug("#======> 0 {}".format(el[0]))
            logger.debug("#======> 1 {}".format(req_items.getlist(el[0])))

            if (el[0][-2:] == '[]') :
                # when receiving params[key][] = 'value1' ...
                #o.params.append({el[0][7:-3]:",".join(req_items.getlist(el[0]))})
                o.params.append({el[0][7:-3]:req_items.getlist(el[0])})
            else :
                # when receiving params[key] = 'value'
                o.params.append({el[0][7:-1]:el[1]})
            
            logger.debug("o.params = {}".format(o.params))
            
        elif el[0].startswith('fields'):
            o.fields=req_items.getlist('fields[]')
        elif el[0].startswith('options'):
            o.options = req_items.getlist('options[]')
    
    try:
        response = o.update()

        if response :
            return success('record updated')
        else :
            return error('an error has occurred')
 
    except Exception, e:
        return error("exception:"+str(e))

