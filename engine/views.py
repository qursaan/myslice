# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from plugins.verticallayout import VerticalLayout
from plugins.tabs import Tabs
from plugins.simplelist import SimpleList
from plugins.slicelist import SliceList
from plugins.quickfilter import QuickFilter
from plugins.raw import Raw

from myslice.viewutils import topmenu_items, the_user
from myslice.viewutils import hard_wired_slice_names, hard_wired_list, lorem_p, lorem, quickfilter_criterias

@login_required
def test_plugin_view (request):
    
    # variables that will get passed to this template
    template_env = {}
    
    main_plugin = \
        VerticalLayout ( title='title for the vertical layout',
        sons = [ SimpleList (title='SimpleList and dataTables',
                             list=hard_wired_list, 
                             header='Hard wired', 
                             foo='the value for foo',
                             with_datatables=True,
                             toggled=False),
                 Tabs (title='Sample Tabs',
                       # *** we select this one to be the active tab ***
                       active='raw2',
                       sons = [ Raw (title='a raw plugin',domid='raw1',
                                     togglable=False,
                                     html= 3*lorem_p),
                                SliceList(title='a slice list',
                                          togglable=False,
                                          list=hard_wired_slice_names),
                                Raw (title='raw title',domid='raw2',
                                     togglable=False,html=lorem) ]),
                 SimpleList (title='SimpleList with slice names', 
                             list=hard_wired_slice_names,
                             ),
                 QuickFilter (list=quickfilter_criterias,
                              title='QuickFilter in main content') ] )
    # define 'content_main' to the template engine
    template_env [ 'content_main' ] = main_plugin.render(request)

    ##########
    # lacks a/href to /slice/%s
    related_plugin = SliceList (title='SliceList plugin',domid='slicelist1',
                                with_datatables='yes', 
                                list=hard_wired_slice_names, 
                                header='Slices')
    # likewise but on the side view
    template_env [ 'content_related' ] = related_plugin.render (request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test Plugin View' 
    template_env [ 'topmenu_items' ] = topmenu_items('plugin', request) 
    template_env [ 'username' ] = the_user (request) 

    # request.plugin_prelude holds a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = request.plugin_prelude.template_env()
    template_env.update(prelude_env)

    return render_to_response ('view-plugin.html',template_env,
                               context_instance=RequestContext(request))
                               
