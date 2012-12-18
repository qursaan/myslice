# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from plugins.simplelist import SimpleList

from myslice.viewutils import topmenu_items, the_user, hard_wired_slice_names

def test_plugin_view (request):
    
    hard_wired_list=[]
    hard_wired_list.append("this hard-wired list")
    hard_wired_list.append("is defined")
    hard_wired_list.append("in <code>plugins.simplelist.py</code>")
    hard_wired_list.append("which in turn relies on")
    hard_wired_list.append("template <code>widget-template.html</code>")
    hard_wired_list.append("while it should of course")
    hard_wired_list.append("instead issue a query")
    hard_wired_list.append("and fill the DOM in js from there")
    hard_wired_list.append("it would however maybe make sense")
    hard_wired_list.append("to offer the option to 'datatablify'")
    hard_wired_list.append("the list from the python code")
    hard_wired_list.append("just like a standard plugin can be set as visible or not")
    hard_wired_list.append("")    
    hard_wired_list.append("OTOH and IMHO, there should be two separate and explicit subclasses of SimpleList for slices or testbeds")

    plugin_main = SimpleList (visible=True, 
                              hidable=True, 
                              list=hard_wired_list, 
                              header='Hard wired', 
                              foo='the value for foo')
    content_main = plugin_main.render (request)

    # lacks a/href to /slice/%s
    plugin_related = SimpleList (visible=True, hidable=True,
                                 need_datatables='yes', 
                                 list=hard_wired_slice_names, 
                                 header='Slices' )
    content_related = plugin_related.render (request)

    

    return render_to_response ('view-plugin.html',
                               {'title': 'Test Plugin View',
                                'topmenu_items': topmenu_items('plugin', request),
                                'content_main' : content_main,
                                'content_related' : content_related,
                                'username' : the_user (request),
                                },
                               context_instance=RequestContext(request))
                               
