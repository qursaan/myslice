# Create your views here.

from django.core.context_processors     import csrf
from django.template                    import RequestContext
from django.template.loader             import render_to_string
from django.shortcuts                   import render_to_response

from django.contrib.auth.decorators     import login_required

from unfold.page                        import Page
from manifold.core.query                import Query

from plugins.stack                      import Stack
from plugins.tabs                       import Tabs
from plugins.lists.staticlist           import StaticList
from plugins.quickfilter                import QuickFilter
from plugins.querycode                  import QueryCode
from plugins.raw                        import Raw
from plugins.messages                   import Messages
from plugins.hazelnut                   import Hazelnut

from myslice.viewutils                  import topmenu_items, the_user
from trash.trashutils                  import hard_wired_slice_names, hard_wired_list, lorem_p, lorem, quickfilter_criterias

#might be useful or not depending on the context
#@login_required
def test_plugin_view (request):

    page = Page(request)
    
    page.expose_js_metadata()

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
        # make sure the 2 things work together
            Messages (
                    page=page,
                    title="Transient Runtime messages",
                    domid="messages-transient",
                    levels='ALL',
                    ),
            Hazelnut (
                    page=page,
                    title="Slice %s - checkboxes"%slicename,
                    query=main_query,
                    domid="hazelnut",
                    checkboxes=True,
                    togglable=True,
                    ),
            Messages (
                    page=page,
                    title="Inline Runtime messages",
                    domid="messages",
                    levels='ALL',
                    togglable=True,
                    transient=False,
                    ),
            Raw (
                    page=page,
                    title="issue messages",
                    togglable=True,
                    html="""
<input type="button" id="bouton" value="Click me" />
""",
                    ),
            ])

    page.add_js_chunks ( """
function issue_debug() {console.log("issue_debug");messages.debug("issue_debug");};
$(function(){$("#bouton").click(issue_debug);});
""")

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
                               
