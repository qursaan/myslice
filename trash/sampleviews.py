# Create your views here.
from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

from unfold.prelude import Prelude

from myslice.viewutils import topmenu_items, the_user
# tmp
from trash.trashutils  import lorem, hard_wired_slice_names

@login_required
def tab_view (request):
    prelude=Prelude( js_files='js/bootstrap.js', css_files='css/bootstrap.css')
    prelude_env = prelude.prelude_env()

    tab_env = {'title':'Page for playing with Tabs',
               'topmenu_items': topmenu_items('tab',request),
               'username':the_user (request),
               'lorem': lorem,                                
               }
    tab_env.update (prelude_env)
    return render_to_response ('view-tab.html', tab_env,
                               context_instance=RequestContext(request))

def scroll_view (request):
    return render_to_response ('view-scroll.html',
                               {'title':'Toy page for scrolling',
                                'topmenu_items': topmenu_items('scroll',request),
                                'username':the_user (request),
                                'lorem':lorem,
                                },
                               context_instance=RequestContext(request))

@login_required
def test_plugin_view (request):

    page = Page(request)
    
    # variables that will get passed to this template
    template_env = {}
    
    main_plugin = \
        Stack ( page=page,
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
                               domid='test-tabs',
                               # *** we select this one to be the active tab ***
                               active_domid='son2',
                               sons = [ Raw (page=page,
                                             title='a raw plugin',
                                             domid='son0',
                                             togglable=False,
                                             html= 3*lorem_p,
                                             ),
                                        StaticList(page=page,
                                                   title='a slice list',
                                                   domid='son1',
                                                   togglable=False,
                                                   header="static list but not togglable",
                                                   list=hard_wired_slice_names,
                                                   ),
                                        Raw (page=page,
                                             title='raw title',
                                             domid='son2',
                                             togglable=False,
                                             html=lorem) ]),
                         StaticList (page=page,
                                     title='SimpleList with slice names', 
                                     list=hard_wired_slice_names,
                                     ),
                         QuickFilter (page=page,
                                      title='QuickFilter in main content',
                                      criterias=quickfilter_criterias,
                                      ) ] )
    # define 'unfold2_main' to the template engine
    template_env [ 'unfold2_main' ] = main_plugin.render(request)

    ##########
    related_plugin = StaticList (page=page,
                                 title='SliceList plugin',domid='slicelist1',
                                 with_datatables='yes', 
                                 list=hard_wired_slice_names, 
                                 header='Slices')
    # likewise but on the side view
    template_env [ 'unfold2_margin' ] = related_plugin.render (request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test Plugin View' 
    template_env [ 'topmenu_items' ] = topmenu_items('plugin', request) 
    template_env [ 'username' ] = the_user (request) 

    # we don't have anythong asynchroneous, and manifold.js is not loaded
#    page.expose_queries ()

    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    return render_to_response ('view-unfold2.html',template_env,
                               context_instance=RequestContext(request))
                               
