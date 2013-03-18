# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from unfold.page import Page
from manifold.manifoldquery import ManifoldQuery

from plugins.verticallayout.verticallayout import VerticalLayout
from plugins.lists.slicelist import SliceList
from plugins.querycode.querycode import QueryCode
from plugins.quickfilter.quickfilter import QuickFilter

from myslice.viewutils import quickfilter_criterias

# 
from myslice.viewutils import topmenu_items, the_user

@login_required
def dashboard_view (request):
    
    page = Page(request)

    slices_query = ManifoldQuery (action='get',
                                  method='slice',
                                  timestamp='latest',
                                  fields=['slice_hrn'],
                                  # xxx filter : should filter on the slices the logged user can see
                                  # we don't have the user's hrn yet
                                  # in addition this currently returns all slices anyways
                                  # filter = ...
                                  sort='slice_hrn',)
    page.enqueue_query (slices_query)

    main_plugin = VerticalLayout (
        page=page,
        title="Putting stuff together",
        sons=[ 
            QueryCode (
                page=page,
                title="Vizualize your query (no syntax highlight for now)",
                query=slices_query,
                toggled=False,
                ),
            QuickFilter (
                page=page,
                title='play with filters',
                criterias=quickfilter_criterias,
                toggled=False,
                ),
            SliceList ( # setting visible attributes first
                page=page,
                title='Asynchroneous SliceList',
                header='slices list', 
                with_datatables=False,
                # this is the query at the core of the slice list
                query=slices_query,
                ),
            ])

    # variables that will get passed to the view-plugin.html template
    template_env = {}
    
    # define 'content_main' to the template engine
    template_env [ 'content_main' ] = main_plugin.render(request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test view for a full request cycle'
    # the menu items on the top 
    template_env [ 'topmenu_items' ] = topmenu_items('dashboard', request) 
    # so we can sho who is logged
    template_env [ 'username' ] = the_user (request) 

#   ########## add another plugin with the same request, on the RHS pane
#   will show up in the right-hand side area named 'related'
    related_plugin = SliceList (
        page=page,
        title='Same request, other layout',
        domid='sidelist',
        with_datatables=True, 
        header='paginated slices',
        # share the query
        query=slices_query,
        )
    # likewise but on the side view
    template_env [ 'content_related' ] = related_plugin.render (request)
    
    # add our own css in the mix
    page.add_css_files ( 'css/dashboard.css')
    
    # don't forget to run the requests
    page.exec_queue_asynchroneously ()

    # xxx create another plugin with the same query and a different layout (with_datatables)
    # show that it worls as expected, one single api call to backend and 2 refreshed views

    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    return render_to_response ('view-plugin.html',template_env,
                               context_instance=RequestContext(request))
