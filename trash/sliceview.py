# Create your views here.

from django.template                 import RequestContext
from django.shortcuts                import render_to_response
from django.contrib.auth.decorators  import login_required
from django.http                     import HttpResponseRedirect

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery
from manifold.manifoldresult         import ManifoldException
from manifold.metadata               import MetaData as Metadata
from myslice.viewutils               import quickfilter_criterias, topmenu_items, the_user

from plugins.raw.raw                 import Raw
from plugins.stack.stack             import Stack
from plugins.tabs.tabs               import Tabs
from plugins.lists.slicelist         import SliceList
from plugins.hazelnut.hazelnut       import Hazelnut 
from plugins.resources_selected      import ResourcesSelected
from plugins.googlemap.googlemap     import GoogleMap 
from plugins.senslabmap.senslabmap   import SensLabMap
from plugins.querycode.querycode     import QueryCode
from plugins.quickfilter.quickfilter import QuickFilter
from plugins.messages.messages       import Messages
from plugins.updater.updater         import Updater

tmp_default_slice='ple.inria.myslicedemo'
debug = True

@login_required
def slice_view (request, slicename=tmp_default_slice):
    # xxx Thierry - ugly hack
    # fetching metadata here might fail - e.g. with an expired session..
    # let's catch this early on and log out our user if needed
    # it should of course be handled in a more generic way
    try:
        return _slice_view(request,slicename)
    except ManifoldException, manifold_result:
        # xxx needs a means to display this message to user...
        from django.contrib.auth import logout
        logout(request)
        return HttpResponseRedirect ('/')
    except Exception, e:
        # xxx we need to sugarcoat this error message in some error template...
        print "Unexpected exception",e
        import traceback
        traceback.print_exc()
        # return ...

def _slice_view (request, slicename):

    page = Page(request)
    page.expose_js_metadata()

    # TODO The query to run is embedded in the URL
    main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
    query_resource_all = Query.get('resource').select('resource_hrn', 'hostname', 'type', 'authority')

    # Get default fields from metadata unless specified
    if not main_query.fields:
        metadata = page.get_metadata()
        md_fields = metadata.details_by_object('slice')
        if debug:
            print "METADATA", md_fields
        # TODO Get default fields
        main_query.select(
                'slice_hrn',
                'resource.resource_hrn', 'resource.hostname', 'resource.type', 'resource.authority',
                'lease.urn',
                'user.user_hrn',
#                'application.measurement_point.counter'
        )

    aq = AnalyzedQuery(main_query, metadata=metadata)
    page.enqueue_query(main_query, analyzed_query=aq)
    page.enqueue_query(query_resource_all)

    # Prepare the display according to all metadata
    # (some parts will be pending, others can be triggered by users).
    # 
    # For example slice measurements will not be requested by default...

    # Create the base layout (Stack)...
    main_plugin = Stack (
        page=page,
        title="Slice !!view for %s"%slicename,
        sons=[],
    )

    # ... responsible for the slice properties...


    main_plugin.insert (
        Raw (page=page,togglable=False, toggled=True,html="<h2> Slice page for %s</h2>"%slicename)
    )

    main_plugin.insert(
        Raw (page=page,togglable=False, toggled=True,html='<b>Description:</b> TODO')
    )

    sq_plugin = Tabs (
        page=page,
        title="Slice view for %s"%slicename,
        togglable=False,
        sons=[],
    )


    # ... and for the relations
    # XXX Let's hardcode resources for now
    sq_resource = aq.subquery('resource')
    sq_user     = aq.subquery('user')
    sq_lease    = aq.subquery('lease')
    sq_measurement = aq.subquery('measurement')
    

    ############################################################################
    # RESOURCES
    # 
    # A stack inserted in the subquery tab that will hold all operations
    # related to resources
    # 
    
    stack_resources = Stack(
        page = page,
        title        = 'Resources',
        sons=[],
    )

    # --------------------------------------------------------------------------
    # Different displays = DataTables + GoogleMaps
    #
    tab_resource_plugins = Tabs(
        page    = page,
        sons = []
    )

    tab_resource_plugins.insert(Hazelnut( 
        page           = page,
        title          = 'List',
        domid          = 'checkboxes',
        # this is the query at the core of the slice list
        query          = sq_resource,
        query_all_uuid = query_resource_all.query_uuid,
        checkboxes     = True,
        datatables_options = { 
            # for now we turn off sorting on the checkboxes columns this way
            # this of course should be automatic in hazelnut
            'aoColumns'      : [None, None, None, None, {'bSortable': False}],
            'iDisplayLength' : 25,
            'bLengthChange'  : True,
        },
    ))

    tab_resource_plugins.insert(GoogleMap(
        page        = page,
        title       = 'Geographic view',
        domid       = 'gmap',
        # tab's sons preferably turn this off
        togglable   = False,
        query       = sq_resource,
        # center on Paris
        latitude    = 49.,
        longitude   = 2.2,
        zoom        = 3,
    ))

    stack_resources.insert(tab_resource_plugins)

    # --------------------------------------------------------------------------
    # ResourcesSelected
    #
    stack_resources.insert(ResourcesSelected(
        page                = page,
        title               = 'Pending operations',
        resource_query_uuid = sq_resource,
        lease_query_uuid    = sq_lease,
        togglable           = True,
    ))

    sq_plugin.insert(stack_resources)

    ############################################################################
    # USERS
    # 

    tab_users = Tabs(
        page         = page,
        title        = 'Users',
        domid        = 'thetabs2',
        # activeid   = 'checkboxes',
        active_domid = 'checkboxes2',
    )
    sq_plugin.insert(tab_users)

    tab_users.insert(Hazelnut( 
        page        = page,
        title       = 'List',
        domid       = 'checkboxes2',
        # tab's sons preferably turn this off
        togglable   = False,
        # this is the query at the core of the slice list
        query       = sq_user,
        checkboxes  = True,
        datatables_options = { 
            # for now we turn off sorting on the checkboxes columns this way
            # this of course should be automatic in hazelnut
            'aoColumns'      : [None, None, None, None, {'bSortable': False}],
            'iDisplayLength' : 25,
            'bLengthChange'  : True,
        },
    ))

    tab_measurements = Tabs (
        page         = page,
        title        = 'Measurements',
        domid        = 'thetabs3',
        # activeid   = 'checkboxes',
        active_domid = 'checkboxes3',
    )
    sq_plugin.insert(tab_measurements)

    tab_measurements.insert(Hazelnut( 
        page        = page,
        title       = 'List',
        domid       = 'checkboxes3',
        # tab's sons preferably turn this off
        togglable   = False,
        # this is the query at the core of the slice list
        query       = sq_measurement,
        checkboxes  = True,
        datatables_options = { 
            # for now we turn off sorting on the checkboxes columns this way
            # this of course should be automatic in hazelnut
            'aoColumns'      : [None, None, None, None, {'bSortable': False}],
            'iDisplayLength' : 25,
            'bLengthChange'  : True,
        },
    ))

    main_plugin.insert(sq_plugin)

    main_plugin.insert(Messages(
        page   = page,
        title  = "Runtime messages for slice %s"%slicename,
        domid  = "msgs-pre",
        levels = "ALL",
    ))
    main_plugin.insert(Updater(
        page   = page,
        title  = "wont show up as non togglable by default",
        query  = main_query,
        label  = "Update slice",
    ))
    

    # END OF JORDAN's CODE

#old#    main_plugin = Stack (
#old#        page=page,
#old#        title="Slice view for %s"%slicename,
#old#        domid='thestack',
#old#        togglable=False,
#old#        sons=[
#old#            Raw (page=page,togglable=False, toggled=True,html="<h2> Slice page for %s</h2>"%slicename),
#old#            Messages (
#old#                page=page,
#old#                title="Runtime messages for slice %s"%slicename,
#old#                domid="msgs-pre",
#old#                levels="ALL",
#old#                ),
#old#            Tabs (
#old#                page=page,
#old#                title="2 tabs : w/ and w/o checkboxes",
#old#                domid='thetabs',
#old#                # active_domid='checkboxes',
#old#                active_domid='gmap',
#old#                sons=[
#old#                    Hazelnut ( 
#old#                        page=page,
#old#                        title='a sample and simple hazelnut',
#old#                        domid='simple',
#old#                        # tab's sons preferably turn this off
#old#                        togglable=False,
#old#                        # this is the query at the core of the slice list
#old#                        query=main_query,
#old#                        ),
#old#                    Hazelnut ( 
#old#                        page=page,
#old#                        title='with checkboxes',
#old#                        domid='checkboxes',
#old#                        # tab's sons preferably turn this off
#old#                        togglable=False,
#old#                        # this is the query at the core of the slice list
#old#                        query=main_query,
#old#                        checkboxes=True,
#old#                        datatables_options = { 
#old#                            # for now we turn off sorting on the checkboxes columns this way
#old#                            # this of course should be automatic in hazelnut
#old#                            'aoColumns' : [ None, None, None, None, {'bSortable': False} ],
#old#                            'iDisplayLength' : 25,
#old#                            'bLengthChange' : True,
#old#                            },
#old#                        ),
#old#                    GoogleMap (
#old#                        page=page,
#old#                        title='geographic view',
#old#                        domid='gmap',
#old#                        # tab's sons preferably turn this off
#old#                        togglable=False,
#old#                        query=main_query,
#old#                        # center on Paris
#old#                        latitude=49.,
#old#                        longitude=2.2,
#old#                        zoom=3,
#old#                        ),
#old#                    Raw (
#old##                    SensLabMap (
#old#                        page=page,
#old#                        title='3D view (disabled)',
#old#                        domid='smap',
#old##                        # tab's sons preferably turn this off
#old#                        togglable=False,
#old##                        query=main_query,
#old#                        html="""<p class='well'>
#old#Thierry: I am commeting off the use of <button class="btn btn-danger">SensLabMap</button> which,
#old# although rudimentarily ported to the django framework, 
#old#causes a weird behaviour especially wrt scrolling. 
#old#On my Mac <button class="btn btn-warning"> I cannot use the mouse to scroll</button> any longer
#old#if I keep this active, so for now it's disabled
#old#</p>""",
#old#                        ),
#old#                    ]),
#old#            Hazelnut ( 
#old#                page=page,
#old#                title='a hazelnut not in tabs',
#old#                domid='standalone',
#old#                # this is the query at the core of the slice list
#old#                query=main_query,
#old#                columns=['hrn','hostname'],
#old#                ),
#old#              # you don't *have to* set a domid, but if you plan on using toggled=persistent then it's required
#old#              # because domid is the key for storing toggle status in the browser
#old#            QueryCode (
#old#                page=page,
#old#                title='xmlrpc code (toggled=False)',
#old#                query=main_query,
#old##                domid='xmlrpc',
#old#                toggled=False,
#old#                ),
#old#            QuickFilter (
#old#                page=page,
#old#                title="QuickFilter - requires metadata (toggled=False)",
#old#                criterias=quickfilter_criterias,
#old#                domid='filters',
#old#                toggled=False,
#old#                ),
#old#            Messages (
#old#                page=page,
#old#                title="Runtime messages (again)",
#old#                domid="msgs-post",
#old#                )
#old#              ])

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
