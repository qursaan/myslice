# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from plugins.verticallayout import VerticalLayout
from plugins.simplelist import SimpleList

from myslice.viewutils import topmenu_items, the_user, hard_wired_slice_names

def test_plugin_view (request):
    
    # variables that will get passed to this template
    template_env = {}
    
    # having html tags right here is not a real use case
    hard_wired_list=[]
    hard_wired_list.append("this hard-wired list")
    hard_wired_list.append("is defined")
    hard_wired_list.append("in plugins.simplelist.py")
    hard_wired_list.append("which in turn relies on")
    hard_wired_list.append("template widget-template.html")
    hard_wired_list.append("while it should of course")
    hard_wired_list.append("instead issue a query")
    hard_wired_list.append("and fill the DOM in js from there")
    hard_wired_list.append("it would however maybe make sense")
    hard_wired_list.append("to offer the option to 'datatablify'")
    hard_wired_list.append("the list from the python code")
    hard_wired_list.append("just like a standard plugin can be set as visible or not")
    hard_wired_list.append("")    
    hard_wired_list.append("OTOH and IMHO, there should be two separate and explicit subclasses of SimpleList for slices or testbeds")

    plugin_main1 = SimpleList (list=hard_wired_list, 
                               header='Hard wired', 
                               foo='the value for foo')
    plugin_main2 = SimpleList (hidable=True, 
                               list=hard_wired_slice_names,
                               headers='Slices in main content')
    layout = VerticalLayout (hidable=True, visible=True,
                             sons=[plugin_main1, plugin_main2]
                             )
#    layout.inspect_request (request,"before first render")
    content_main = layout.render (request)
#    layout.inspect_request (request,"after first render")
    # this will be rendered as the main content - as per view-plugin.html and thus layout-myslice.html
    template_env [ 'content_main' ] = content_main

    ##########
    # lacks a/href to /slice/%s
    plugin_related = SimpleList (visible=True, hidable=True,
                                 need_datatables='yes', 
                                 list=hard_wired_slice_names, 
                                 header='Slices' )
    content_related = plugin_related.render (request)
    # likewise but on the side view
    template_env [ 'content_related' ] = content_related

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test Plugin View' 
    template_env [ 'topmenu_items' ] = topmenu_items('plugin', request) 
    template_env [ 'username' ] = the_user (request) 

    # request.plugin_prelude holds a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = request.plugin_prelude.render_env()
    template_env.update(prelude_env)

    return render_to_response ('view-plugin.html',template_env,
                               context_instance=RequestContext(request))
                               
