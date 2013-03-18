# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from unfold.page import Page

from plugins.verticallayout.verticallayout import VerticalLayout
from plugins.tabs.tabs import Tabs
from plugins.lists.staticlist import StaticList
from plugins.quickfilter.quickfilter import QuickFilter
from plugins.raw.raw import Raw

from myslice.viewutils import topmenu_items, the_user
from myslice.viewutils import hard_wired_slice_names, hard_wired_list, lorem_p, lorem, quickfilter_criterias

@login_required
def test_plugin_view (request):

    page = Page(request)
    
    # variables that will get passed to this template
    template_env = {}
    
    main_plugin = \
        VerticalLayout ( page=page,
                         title='title for the vertical layout',
                         sons = [ StaticList (page=page,
                                              title='StaticList - with datatables - starts toggled off',
                                              list=hard_wired_list, 
                                              header='Hard wired header', 
                                              foo='the value for foo',
                                              with_datatables=True,
                                              toggled=False),
                                  Tabs (page=page,
                                        title='Sample Tabs',
                                        # *** we select this one to be the active tab ***
                                        active='raw2',
                                        sons = [ Raw (page=page,
                                                      title='a raw plugin',domid='raw1',
                                                      togglable=False,
                                                      html= 3*lorem_p),
                                                 StaticList(page=page,
                                                            title='a slice list',
                                                            togglable=False,
                                                            header="static list but not togglable",
                                                            list=hard_wired_slice_names),
                                                 Raw (page=page,
                                                      title='raw title',domid='raw2',
                                                      togglable=False,html=lorem) ]),
                                  StaticList (page=page,
                                              title='SimpleList with slice names', 
                                              list=hard_wired_slice_names,
                                              ),
                                  QuickFilter (page=page,
                                               title='QuickFilter in main content',
                                               criterias=quickfilter_criterias,
                                               ) ] )
    # define 'content_main' to the template engine
    template_env [ 'content_main' ] = main_plugin.render(request)

    ##########
    related_plugin = StaticList (page=page,
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

    # we don't have anythong asynchroneous, but that doesn't hurt...
    page.exec_queue_asynchroneously ()

    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    return render_to_response ('view-plugin.html',template_env,
                               context_instance=RequestContext(request))
                               
