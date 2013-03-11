# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from engine.pluginset import PluginSet

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

    pluginset = PluginSet(request)
    
    # variables that will get passed to this template
    template_env = {}
    
    main_plugin = \
        VerticalLayout ( pluginset=pluginset,
                         title='title for the vertical layout',
                         sons = [ SimpleList (pluginset=pluginset,
                                              title='SimpleList and dataTables',
                                              list=hard_wired_list, 
                                              header='Hard wired', 
                                              foo='the value for foo',
                                              with_datatables=True,
                                              toggled=False),
                                  Tabs (pluginset=pluginset,
                                        title='Sample Tabs',
                                        # *** we select this one to be the active tab ***
                                        active='raw2',
                                        sons = [ Raw (pluginset=pluginset,
                                                      title='a raw plugin',domid='raw1',
                                                      togglable=False,
                                                      html= 3*lorem_p),
                                                 SliceList(pluginset=pluginset,
                                                           title='a slice list',
                                                           togglable=False,
                                                           list=hard_wired_slice_names),
                                                 Raw (pluginset=pluginset,
                                                      title='raw title',domid='raw2',
                                                      togglable=False,html=lorem) ]),
                                  SimpleList (pluginset=pluginset,
                                              title='SimpleList with slice names', 
                                              list=hard_wired_slice_names,
                                              ),
                                  QuickFilter (list=quickfilter_criterias,
                                               pluginset=pluginset,
                                               title='QuickFilter in main content') ] )
    # define 'content_main' to the template engine
    template_env [ 'content_main' ] = main_plugin.render(request)

    ##########
    # lacks a/href to /slice/%s
    related_plugin = SliceList (pluginset=pluginset,
                                title='SliceList plugin',domid='slicelist1',
                                with_datatables='yes', 
                                list=hard_wired_slice_names, 
                                header='Slices')
    # likewise but on the side view
    template_env [ 'content_related' ] = related_plugin.render (request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test Plugin View' 
    template_env [ 'topmenu_items' ] = topmenu_items('plugin', request) 
    template_env [ 'username' ] = the_user (request) 

    pluginset.exec_queue_asynchroneously ()

    # the prelude object in pluginset contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = pluginset.template_env()
    template_env.update(prelude_env)
    return render_to_response ('view-plugin.html',template_env,
                               context_instance=RequestContext(request))
                               
