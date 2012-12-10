# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from plugins.simplelist import SimpleList

def test_plugin_view (request):
    
    test_plugin = SimpleList (visible=True, hidable=True)
    plugin_content = test_plugin.render ()

    print '--------------------'
    print plugin_content
    print '--------------------'

    return render_to_response ('test-plugin.html',
                               {'content_main' : plugin_content},
                               context_instance=RequestContext(request))
                               
