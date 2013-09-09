# Create your views here.

from django.core.context_processors     import csrf
from django.template                    import RequestContext
from django.template.loader             import render_to_string
from django.shortcuts                   import render_to_response

from django.contrib.auth.decorators     import login_required

from unfold.page                        import Page
from manifold.core.query                import Query

from plugins.stack.stack                import Stack
from plugins.tabs.tabs                  import Tabs
from plugins.lists.staticlist           import StaticList
from plugins.quickfilter.quickfilter    import QuickFilter
from plugins.querycode.querycode        import QueryCode
from plugins.raw.raw                    import Raw
from plugins.messages.messages          import Messages
from plugins.hazelnut                   import Hazelnut
from plugins.updater                    import Updater

from myslice.viewutils                  import topmenu_items, the_user
from trash.trashutils                  import hard_wired_slice_names, hard_wired_list, lorem_p, lorem, quickfilter_criterias

@login_required
def test_plugin_view (request):

    page = Page(request)
    
    # variables that will get passed to this template
    template_env = {}
    
    slicename='ple.inria.heartbeat'
    main_query = Query.get('resource').filter_by('slice_hrn', '=', slicename).select(['network','type','hrn','hostname','sliver'])
    # without an hazelnut, this would use use : run_it=False as nothing would listen to the results
    page.enqueue_query (main_query, # run_it=False
                        )

    main_plugin = \
        Stack (
        page=page,
        title='thestack',
        togglable=True,
        domid='stack',
        sons=[ \
# this updater thing never made it to production                
#            Updater (
#                    page=page,
#                    title="Won't show up as non togglable",
#                    query=main_query,
#                    label="Update me",
#                    domid="the-updater",
#                ),
        # make sure the 2 things work together
            Hazelnut (
                    page=page,
                    title="Slice %s - checkboxes interacting w/ updater"%slicename,
                    query=main_query,
                    domid="hazelnut",
                    checkboxes=True,
                    togglable=True,
                    ),
            Messages (
                    page=page,
                    title="Runtime messages",
                    domid="messages",
                    levels='ALL',
                    togglable=True,
                    ),
            ])

    # define 'unfold1_main' to the template engine
    template_env [ 'unfold1_main' ] = main_plugin.render(request)

    # more general variables expected in the template
    template_env [ 'title' ] = 'Single Plugin View' 
    template_env [ 'topmenu_items' ] = topmenu_items('plugin', request) 
    template_env [ 'username' ] = the_user (request) 

    # run queries when we have any
    page.expose_queries ()

    # the prelude object in page contains a summary of the requirements() for all plugins
    # define {js,css}_{files,chunks}
    prelude_env = page.prelude_env()
    template_env.update(prelude_env)
    return render_to_response ('view-unfold1.html',template_env,
                               context_instance=RequestContext(request))
                               
