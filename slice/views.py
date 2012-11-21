# Create your views here.
from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

def foo (request):
    
    content_string = render_to_string ('foo-menu.html',
                                       {'menu_items' : {'item1':'/url1/', 'item2':'/url2',},
                                        'current_item': 'item1'})
    
    result=render_to_response('foo.html',{'foo':'bar', 'content_string' : content_string },
                              context_instance=RequestContext(request))

    print 'foo : result=',result

    return result
