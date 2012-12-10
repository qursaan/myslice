# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from plugins.simplelist import SimpleList

from myslice.viewutils import menu_items, the_user

def test_plugin_view (request):
    
    test_plugin = SimpleList (visible=True, hidable=True)
    plugin_content = test_plugin.render (request)

    print '--------------------'
    print plugin_content
    print '--------------------'

    return render_to_response ('view-plugin.html',
                               {'title': 'Test Plugin View',
                                'menu_items': menu_items('plugin', request),
                                'content_main' : plugin_content,
                                'username' : the_user (request),
                                },
                               context_instance=RequestContext(request))
                               
