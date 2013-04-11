# Create your views here.

from django.template import RequestContext
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from unfold.page import Page
from manifold.manifoldquery import ManifoldQuery

from plugins.raw.raw import Raw
from plugins.stack.stack import Stack
from plugins.tabs.tabs import Tabs
from plugins.lists.slicelist import SliceList
from plugins.hazelnut.hazelnut import Hazelnut 
from plugins.googlemap.googlemap import GoogleMap 
from plugins.senslabmap.senslabmap import SensLabMap
from plugins.querycode.querycode import QueryCode
from plugins.quickfilter.quickfilter import QuickFilter
from plugins.messages.messages import Messages

from myslice.viewutils import quickfilter_criterias

from myslice.viewutils import topmenu_items, the_user

tmp_default_slice='ple.inria.sfatest'

@login_required
def slice_view (request, slicename=tmp_default_slice):
    
    page = Page(request)

    main_query = ManifoldQuery (action='get',
                                subject='resource',
                                timestamp='latest',
                                fields=['network','type','hrn','hostname'],
                                filters= [ [ 'slice_hrn', '=', slicename, ] ],
                                )
    page.enqueue_query (main_query)

    main_plugin = Stack (
        page=page,
        title="Slice view for %s"%slicename,
        domid='thestack',
        togglable=False,
        sons=[
            Messages (
                page=page,
                title="Runtime messages",
                domid="msgs-pre",
                ),
            Tabs (
                page=page,
                title="2 tabs : w/ and w/o checkboxes",
                domid='thetabs',
                # active_domid='checkboxes',
                active_domid='gmap',
                sons=[
                    Hazelnut ( 
                        page=page,
                        title='a sample and simple hazelnut',
                        domid='simple',
                        # tab's sons preferably turn this off
                        togglable=False,
                        # this is the query at the core of the slice list
                        query=main_query,
                        ),
                    Hazelnut ( 
                        page=page,
                        title='with checkboxes',
                        domid='checkboxes',
                        # tab's sons preferably turn this off
                        togglable=False,
                        # this is the query at the core of the slice list
                        query=main_query,
                        checkboxes=True,
                        datatables_options = { 
                            # for now we turn off sorting on the checkboxes columns this way
                            # this of course should be automatic in hazelnut
                            'aoColumns' : [ None, None, None, None, {'bSortable': False} ],
                            'iDisplayLength' : 25,
                            'bLengthChange' : True,
                            },
                        ),
                    GoogleMap (
                        page=page,
                        title='geographic view',
                        domid='gmap',
                        # tab's sons preferably turn this off
                        togglable=False,
                        query=main_query,
                        ),
                    Raw (
#                    SensLabMap (
                        page=page,
                        title='3D view (disabled)',
                        domid='smap',
#                        # tab's sons preferably turn this off
                        togglable=False,
#                        query=main_query,
                        html="""<p class='well'>
Thierry: I am commeting off the use of <button class="btn btn-danger">SensLabMap</button> which,
 although rudimentarily ported to the django framework, 
causes a weird behaviour especially wrt scrolling. 
On my Mac <button class="btn btn-warning"> I cannot use the mouse to scroll</button> any longer
if I keep this active, so for now it's disabled
</p>""",
                        ),
                    ]),
            Hazelnut ( 
                page=page,
                title='not in tabs',
                domid='standalone',
                # this is the query at the core of the slice list
                query=main_query,
                columns=['hrn','hostname'],
                ),
              # you don't *have to* set a domid, but if you plan on using toggled=persistent then it's required
              # because domid is the key for storing toggle status in the browser
            QueryCode (
                page=page,
                title='xmlrpc code (toggled=False)',
                query=main_query,
#                domid='xmlrpc',
                toggled=False,
                ),
            QuickFilter (
                page=page,
                title="QuickFilter - requires metadata (toggled=False)",
                criterias=quickfilter_criterias,
                domid='filters',
                toggled=False,
                ),
            Messages (
                page=page,
                title="Runtime messages (again)",
                domid="msgs-post",
                )
              ])

    # variables that will get passed to the view-unfold1.html template
    template_env = {}
    
    # define 'unfold1_main' to the template engine - the main contents
    template_env [ 'unfold1_main' ] = main_plugin.render(request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test view that combines various plugins'
    # the menu items on the top
    template_env [ 'topmenu_items' ] = topmenu_items('slice', request) 
    # so we can sho who is logged
    template_env [ 'username' ] = the_user (request) 

    # don't forget to run the requests
    page.expose_queries ()

    # xxx create another plugin with the same query and a different layout (with_datatables)
    # show that it worls as expected, one single api call to backend and 2 refreshed views

    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    result=render_to_response ('view-unfold1.html',template_env,
                               context_instance=RequestContext(request))
    return result
