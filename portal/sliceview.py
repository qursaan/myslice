from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from unfold.loginrequired            import LoginRequiredAutoLogoutView

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery

from ui.topmenu                      import topmenu_items, the_user

from plugins.raw                     import Raw
from plugins.stack                   import Stack
from plugins.tabs                    import Tabs
from plugins.hazelnut                import Hazelnut 
from plugins.resources_selected      import ResourcesSelected
from plugins.googlemap               import GoogleMap
from plugins.senslabmap              import SensLabMap
from plugins.querycode               import QueryCode
from plugins.query_editor            import QueryEditor
from plugins.active_filters          import ActiveFilters
from plugins.quickfilter             import QuickFilter
from plugins.messages                import Messages
from plugins.slicestat               import Slicestat

from myslice.config                  import Config

tmp_default_slice='ple.upmc.myslicedemo'

# temporary : turn off the users part to speed things up
#do_query_users=True
do_query_users=False

class SliceView (LoginRequiredAutoLogoutView):

    def get (self,request, slicename=tmp_default_slice):
    
        page = Page(request)
        page.add_css_files ('css/slice-view.css')
        page.add_js_files  ( [ "js/common.functions.js" ] )
        page.add_js_chunks ('$(function() { messages.debug("sliceview: jQuery version " + $.fn.jquery); });')
        page.add_js_chunks ('$(function() { messages.debug("sliceview: users turned %s"); });'%("on" if do_query_users else "off"))
        config=Config()
        page.add_js_chunks ('$(function() { messages.debug("manifold URL %s"); });'%(config.manifold_url()))
        page.expose_js_metadata()
    
        metadata = page.get_metadata()
        resource_md = metadata.details_by_object('resource')
        resource_fields = [column['name'] for column in resource_md['column']]
    
        user_md = metadata.details_by_object('user')
        user_fields = ['user_hrn'] # [column['name'] for column in user_md['column']]
    
        # TODO The query to run is embedded in the URL
        main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
        main_query.select(
                'slice_hrn',
                'resource.hrn', 'resource.hostname', 'resource.type', 
                'resource.network_hrn',
                #'lease.urn',
                'user.user_hrn',
                #'application.measurement_point.counter'
        )
    
        query_resource_all = Query.get('resource').select(resource_fields)
        if do_query_users:
            query_user_all = Query.get('user').select(user_fields)
    
        aq = AnalyzedQuery(main_query, metadata=metadata)
        page.enqueue_query(main_query, analyzed_query=aq)
        page.enqueue_query(query_resource_all)
        if do_query_users:
            page.enqueue_query(query_user_all)
    
        # ... and for the relations
        # XXX Let's hardcode resources for now
        sq_resource    = aq.subquery('resource')
        sq_user        = aq.subquery('user')
        sq_lease       = aq.subquery('lease')
        sq_measurement = aq.subquery('measurement')
        
    
        # Prepare the display according to all metadata
        # (some parts will be pending, others can be triggered by users).
        # 
        # For example slice measurements will not be requested by default...
    
        # Create the base layout (Stack)...
        main_stack = Stack (
            page=page,
            title="Slice %s"%slicename,
            sons=[],
        )
    
        # ... responsible for the slice properties...
    
        # a nice header
        main_stack.insert (
            Raw (page=page,
                 togglable=False, 
                 toggled=True,
                 html="<h2 class='well well-lg'> Slice %s</h2>"%slicename)
        )
    
        # --------------------------------------------------------------------------
        # ResourcesSelected (Pending Operations)

        main_stack.insert(ResourcesSelected(
            page                = page,
            title               = 'Pending operations',
            query               = main_query,
            togglable           = True,
            # start turned off, it will open up itself when stuff comes in
            toggled             = False, 
            domid               = 'pending',
            outline_complete    = True,
        ))

        # --------------------------------------------------------------------------
        # Filter Resources
       
        filter_query_editor = QueryEditor(
            page  = page,
            query = sq_resource, 
            query_all = query_resource_all,
            title = "Select Columns",
            domid = 'select-columns',
            )
        filter_active_filters = ActiveFilters(
            page  = page,
            query = sq_resource,
            title = "Active Filters",
            )
        filters_area = Stack(
            page                = page,
            title               = 'Filter Resources',
            domid               = 'filters',
            sons                = [filter_query_editor, filter_active_filters],
            togglable           = True,
            toggled             = 'persistent',
            outline_complete    = True, 
        )
        main_stack.insert (filters_area)

        # --------------------------------------------------------------------------
        # RESOURCES
        # the resources part is made of a Tabs (Geographic, List), 

        resources_as_map = GoogleMap(
            page       = page,
            title      = 'Geographic view',
            domid      = 'resources-map',
            # tab's sons preferably turn this off
            togglable  = False,
            query      = sq_resource,
            query_all  = query_resource_all,
            checkboxes = True,
            # center on Paris
            latitude   = 49.,
            longitude  = 9,
            zoom       = 4,
        )

        resources_as_list = Hazelnut( 
            page       = page,
            domid      = 'resources-list',
            title      = 'List view',
            # this is the query at the core of the slice list
            query      = sq_resource,
            query_all  = query_resource_all,
            checkboxes = True,
            datatables_options = { 
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
            )

        resources_stats_cpu = Slicestat(
            title = "CPU Usage",
            domid = 'resources-stats-cpu',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'cpu'
        )
        
        resources_stats_mem = Slicestat(
            title = "Memory Usage",
            domid = 'resources-stats-mem',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'mem'
        )
        
        resources_stats_asb = Slicestat(
            title = "Traffic Sent",
            domid = 'resources-stats-asb',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'asb'
        )
        
        resources_stats_arb = Slicestat(
            title = "Traffic Received",
            domid = 'resources-stats-arb',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'arb'
        )
        
        # with the new 'Filter' stuff on top, no need for anything but the hazelnut
        resources_as_list_area = resources_as_list 

        resources_area = Tabs ( page=page, 
                                domid="resources",
                                togglable=True,
                                title="Resources",
                                outline_complete=True,
                                sons=[ resources_as_map, resources_as_list_area, resources_stats_cpu, resources_stats_mem, resources_stats_asb, resources_stats_arb ],
                                active_domid = 'resources-map',
                                )
        main_stack.insert (resources_area)

        # --------------------------------------------------------------------------
        # USERS
    
<<<<<<< HEAD
        if do_query_users:
            tab_users = Tabs(
                page                = page,
                domid               = 'users',
                outline_complete    = True,
                togglable           = True,
                title               = 'Users',
                active_domid        = 'users-list',
                )
            main_stack.insert(tab_users)
    
            tab_users.insert(Hazelnut( 
                page        = page,
                title       = 'Users List',
                domid       = 'users-list',
                # tab's sons preferably turn this off
                togglable   = False,
                # this is the query at the core of the slice list
                query       = sq_user,
                query_all  = query_user_all,
                checkboxes  = True,
                datatables_options = { 
                    'iDisplayLength' : 25,
                    'bLengthChange'  : True,
                    'bAutoWidth'     : True,
                },
            ))
            
        
=======
        if do_query_users:
            tab_users = Tabs(
                page                = page,
                domid               = 'users',
                outline_complete    = True,
                togglable           = True,
                title               = 'Users',
                active_domid        = 'users-list',
                )
            main_stack.insert(tab_users)
    
            tab_users.insert(Hazelnut( 
                page        = page,
                title       = 'Users List',
                domid       = 'users-list',
                # tab's sons preferably turn this off
                togglable   = False,
                # this is the query at the core of the slice list
                query       = sq_user,
                query_all  = query_user_all,
                checkboxes  = True,
                datatables_options = { 
                    'iDisplayLength' : 25,
                    'bLengthChange'  : True,
                    'bAutoWidth'     : True,
                },
            ))
>>>>>>> 0c8a634162f3271018102e75a3934c5db5e48f59
# DEMO    
        # --------------------------------------------------------------------------
        # MEASUREMENTS
#        tab_measurements = Tabs (
#            page                = page,
#            active_domid        = 'measurements-list',
#            outline_complete    = True,
#            togglable           = True,
#            title               = 'Measurements',
#            domid               = 'measurements',
#        )
#        main_stack.insert(tab_measurements)
#    
#        tab_measurements.insert(Hazelnut( 
#            page        = page,
#            title       = 'Measurements',
#            domid       = 'measurements-list',
#            # tab's sons preferably turn this off
#            togglable   = False,
#            # this is the query at the core of the slice list
#            query       = sq_measurement,
#            # do NOT set checkboxes to False
#            # this table being otherwise empty, it just does not fly with dataTables
#            checkboxes  = True,
#            datatables_options = { 
#                'iDisplayLength' : 25,
#                'bLengthChange'  : True,
#                'bAutoWidth'     : True,
#            },
#        ))
#    
#        # --------------------------------------------------------------------------
#        # MESSAGES (we use transient=False for now)
#        main_stack.insert(Messages(
#            page   = page,
#            title  = "Runtime messages for slice %s"%slicename,
#            domid  = "msgs-pre",
#            levels = "ALL",
#            # plain messages are probably less nice for production but more reliable for development for now
#            transient = False,
#            # these make sense only in non-transient mode..
#            togglable = True,
#            toggled = 'persistent',
#            outline_complete = True,
#        ))
#    
    
        # variables that will get passed to the view-unfold1.html template
        template_env = {}
        
        # define 'unfold1_main' to the template engine - the main contents
        template_env [ 'unfold1_main' ] = main_stack.render(request)
    
        # more general variables expected in the template
        template_env [ 'title' ] = '%(slicename)s'%locals()
        # the menu items on the top
        template_env [ 'topmenu_items' ] = topmenu_items('Slice', request) 
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
