# Create your views here.

from django.template import RequestContext
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from unfold.page import Page
from manifold.manifoldquery import ManifoldQuery

from plugins.stack.stack import Stack
from plugins.tabs.tabs import Tabs
from plugins.hazelnut.hazelnut import Hazelnut 
from plugins.lists.slicelist import SliceList
from plugins.querycode.querycode import QueryCode
from plugins.quickfilter.quickfilter import QuickFilter

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
#        togglable=False,
        sons=[Tabs (
                page=page,
                title="2 tabs : w/ and w/o checkboxes",
                domid='thetabs',
#                toggled=False,
                active_domid='checkboxes',
                sons=[
                    Hazelnut ( 
                        page=page,
                        title='a sample and simple hazelnut',
                        domid='simple',
                        togglable=False,
                        # this is the query at the core of the slice list
                        query=main_query,
                        ),
                    Hazelnut ( 
                        page=page,
                        title='with checkboxes',
                        domid='checkboxes',
                        togglable=False,
                        checkboxes=True,
                        # this is the query at the core of the slice list
                        query=main_query,
                        ),
                    ]),
              Hazelnut ( 
                page=page,
                title='not in tabs',
                domid='standalone',
#                toggled=False,
                # this is the query at the core of the slice list
                query=main_query,
                columns=['hrn','hostname'],
                ),
              QueryCode (
                page=page,
                title='xmlrpc code',
                query=main_query,
#                toggled=False,
                ),
              QuickFilter (
                page=page,
                title="QuickFilter is currently the only one that requires metadata",
                criterias=quickfilter_criterias
                ),
              ])

    # variables that will get passed to the view-unfold1.html template
    template_env = {}
    
    # define 'unfold1_main' to the template engine - the main contents
    template_env [ 'unfold1_main' ] = main_plugin.render(request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test view for hazelnut'
    # the menu items on the top
    template_env [ 'topmenu_items' ] = topmenu_items('slice', request) 
    # so we can sho who is logged
    template_env [ 'username' ] = the_user (request) 

    # don't forget to run the requests
    page.exec_queue_asynchroneously ()

    # xxx create another plugin with the same query and a different layout (with_datatables)
    # show that it worls as expected, one single api call to backend and 2 refreshed views

    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    result=render_to_response ('view-unfold1.html',template_env,
                               context_instance=RequestContext(request))
    return result
