# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from unfold.page import Page
from manifold.core.query import Query

from plugins.stack import Stack
from plugins.lists.slicelist import SliceList
from plugins.querycode import QueryCode
from plugins.quickfilter import QuickFilter

from trash.trashutils import quickfilter_criterias

# 
from ui.topmenu import topmenu_items_live, the_user

@login_required
def dashboard_view (request):
    
    page = Page(request)

    slices_query = Query.get('slice').select('slice_hrn')
#old#                                  # xxx filter : should filter on the slices the logged user can see
#old#                                  # we don't have the user's hrn yet
#old#                                  # in addition this currently returns all slices anyways
#old#                                  # filter = ...
#old#                                  sort='slice_hrn',)
    page.enqueue_query (slices_query)

    main_plugin = Stack (
        page=page,
        title="Putting stuff together",
        sons=[ 
            QueryCode (
                page=page,
                title="Vizualize your query",
                query=slices_query,
                toggled=False,
                ),
            QuickFilter (
                # we play with this one for demo purposes in dashboard.css
                domid='myquickfilter',
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

    # variables that will get passed to the view-unfold2.html template
    template_env = {}
    
    # define 'unfold_main' to the template engine
    template_env [ 'unfold_main' ] = main_plugin.render(request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test view for a full request cycle'
    # the menu items on the top 
    template_env [ 'topmenu_items' ] = topmenu_items_live('dashboard', page) 
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
    template_env [ 'unfold_margin' ] = related_plugin.render (request)
    
    # add our own css in the mix
    #page.add_css_files ( 'css/dashboard.css')
    
    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    return render_to_response ('view-unfold2.html',template_env,
                               context_instance=RequestContext(request))
