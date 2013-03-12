# Create your views here.

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

from django.contrib.auth.decorators import login_required

from engine.pluginset import PluginSet
from engine.manifoldquery import ManifoldQuery

from plugins.slicelist import SliceList

# 
from myslice.viewutils import topmenu_items, the_user

@login_required
def dashboard_view (request):
    
    pluginset = PluginSet(request)

    slices_query = ManifoldQuery (action='get',
                                  method='slice',
                                  timestamp='latest',
                                  fields=['slice_hrn'],
                                  # xxx filter : should filter on the slices the logged user can see
                                  # we don't have the user's hrn yet
                                  # in addition this currently returns all slices anyways
                                  # filter = ...
                                  sort='slice_hrn',)
    pluginset.enqueue_query (slices_query)

    main_plugin = SliceList ( # setting visible attributes first
        pluginset=pluginset,
        title='Asynchroneous SliceList',
        header='slices list', 
        with_datatables=False,
        toggled=True,
        # this is the query at the core of the slice list
        query=slices_query,
        )

    # variables that will get passed to the view-plugin.html template
    template_env = {}
    
    # define 'content_main' to the template engine
    template_env [ 'content_main' ] = main_plugin.render(request)

#    ########## add another plugin with the same request, on the RHS pane
#    # lacks a/href to /slice/%s
#    related_plugin = SliceList (title='SliceList plugin',domid='slicelist1',
#                                with_datatables='yes', 
#                                list=hard_wired_slice_names, 
#                                header='Slices')
#    # likewise but on the side view
#    template_env [ 'content_related' ] = related_plugin.render (request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Test view for a full request cycle'
    # the menu items on the top 
    template_env [ 'topmenu_items' ] = topmenu_items('dashboard', request) 
    # so we can sho who is logged
    template_env [ 'username' ] = the_user (request) 

    ##########
    # lacks a/href to /slice/%s
    related_plugin = SliceList (
        pluginset=pluginset,
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
    pluginset.add_css_files ( 'css/dashboard.css')
    
    # don't forget to run the requests
    pluginset.exec_queue_asynchroneously ()

    # xxx create another plugin with the same query and a different layout (with_datatables)
    # show that it worls as expected, one single api call to backend and 2 refreshed views

    # the prelude object in pluginset contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = pluginset.template_env()
    template_env.update(prelude_env)
    return render_to_response ('view-plugin.html',template_env,
                               context_instance=RequestContext(request))
