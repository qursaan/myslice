import json
from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from unfold.loginrequired            import LoginRequiredAutoLogoutView

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from ui.topmenu                      import topmenu_items_live, the_user

from plugins.raw                     import Raw
from plugins.stack                   import Stack
from plugins.tabs                    import Tabs
from plugins.querytable              import QueryTable 
from plugins.querygrid               import QueryGrid
from plugins.queryupdater            import QueryUpdater
from plugins.googlemap               import GoogleMap
from plugins.senslabmap              import SensLabMap
from plugins.scheduler               import Scheduler
from plugins.querycode               import QueryCode
# Thierry
# stay away from query editor for now as it seems to make things go very slow
# see https://lists.myslice.info/pipermail/devel-myslice/2013-December/000221.html 
from plugins.query_editor            import QueryEditor
from plugins.active_filters          import ActiveFilters
from plugins.quickfilter             import QuickFilter
from plugins.messages                import Messages
from plugins.slicestat               import SliceStat

from myslice.configengine            import ConfigEngine

from myslice.theme import ThemeView

tmp_default_slice='ple.upmc.myslicedemo'

# temporary : turn off the users part to speed things up
#do_query_users=True
do_query_users=False

#do_query_leases=True
do_query_leases=False

insert_grid=False
#insert_grid=True

insert_messages=False
#insert_messages=True

class SliceView (LoginRequiredAutoLogoutView, ThemeView):

    def get (self,request, slicename=tmp_default_slice):
    
        page = Page(request)
        page.add_css_files ('css/slice-view.css')
        page.add_js_files  ( [ "js/common.functions.js" ] )
        page.add_js_chunks ('$(function() { messages.debug("sliceview: jQuery version " + $.fn.jquery); });')
        page.add_js_chunks ('$(function() { messages.debug("sliceview: users turned %s"); });'%("on" if do_query_users else "off"))
        page.add_js_chunks ('$(function() { messages.debug("sliceview: leases turned %s"); });'%("on" if do_query_leases else "off"))
        page.add_js_chunks ('$(function() { messages.debug("manifold URL %s"); });'%(ConfigEngine().manifold_url()))

        metadata = page.get_metadata()
        resource_md = metadata.details_by_object('resource')
        resource_fields = [column['name'] for column in resource_md['column']]
    
        user_md = metadata.details_by_object('user')
        user_fields = ['user_hrn'] # [column['name'] for column in user_md['column']]
    
        # TODO The query to run is embedded in the URL
        main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
        main_query.select(
                'slice_hrn',
                #'resource.hrn', 'resource.urn', 
                'resource.hostname', 'resource.type', 
                'resource.network_hrn',
                'lease.urn',
                'user.user_hrn',
                #'application.measurement_point.counter'
        )
        # for internal use in the querytable plugin;
        # needs to be a unique column present for each returned record
        main_query_init_key = 'hostname'
    
        query_resource_all = Query.get('resource').select(resource_fields)

        aq = AnalyzedQuery(main_query, metadata=metadata)
        page.enqueue_query(main_query, analyzed_query=aq)
        page.enqueue_query(query_resource_all)
        if do_query_users:
            # Required: the user must have an authority in its user.config
            # XXX Temporary solution
            user_query  = Query().get('local:user').select('config','email')
            user_details = execute_query(self.request, user_query)
            
            # not always found in user_details...
            config={}
#            for user_detail in user_details:
#                #email = user_detail['email']
#                if user_detail['config']:
#                    config = json.loads(user_detail['config'])
#            user_detail['authority'] = config.get('authority',"Unknown Authority")
#
#            if user_detail['authority'] is not None:
#                sub_authority = user_detail['authority'].split('.')
#                root_authority = sub_authority[0]
#                query_user_all = Query.get(root_authority+':user').select(user_fields)
#
#                # XXX TODO this filter doesn't work - to be improved in Manifold
#                #.filter_by('authority.authority_hrn', '=', user_detail['authority'])
#
#                page.enqueue_query(query_user_all)
#            else:
#                print "authority of the user is not in local:user db"
            query_user_all = Query.get('user').select(user_fields)
            #    query_user_all = None
    
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
        # QueryUpdater (Pending Operations)

        main_stack.insert(QueryUpdater(
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
       
# turn off for now -- see above
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
            sons                = [filter_query_editor, 
                                   filter_active_filters],
            togglable           = True,
            toggled             = 'persistent',
            outline_complete    = True, 
        )
        main_stack.insert (filters_area)

        # --------------------------------------------------------------------------
        # RESOURCES
        # the resources part is made of a Tabs (Geographic, List), 

        resources_as_gmap = GoogleMap(
            page       = page,
            title      = 'Geographic view',
            domid      = 'resources-map',
            # tab's sons preferably turn this off
            togglable  = False,
            query      = sq_resource,
            query_all  = query_resource_all,
            # this key is the one issued by google
            googlemap_api_key = ConfigEngine().googlemap_api_key(),
            # the key to use at init-time
            init_key   = main_query_init_key,
            checkboxes = True,
            # center on Paris
            latitude   = 49.,
            longitude  = 9,
            zoom       = 4,
        )

        resources_as_3dmap = SensLabMap(
            page       = page,
            title      = '3D Map',
            domid      = 'senslabmap',
            query      = sq_resource,
            query_all  = query_resource_all,
        )

        resources_as_list = QueryTable( 
            page       = page,
            domid      = 'resources-list',
            title      = 'List view',
            # this is the query at the core of the slice list
            query      = sq_resource,
            query_all  = query_resource_all,
            init_key     = main_query_init_key,
            checkboxes = True,
            datatables_options = { 
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
            )

        if insert_grid:
            resources_as_grid = QueryGrid( 
                page       = page,
                domid      = 'resources-grid',
                title      = 'Grid view',
                # this is the query at the core of the slice list
                query      = sq_resource,
                query_all  = query_resource_all,
                init_key     = main_query_init_key,
                checkboxes = True,
                )

        if do_query_leases:
            resources_as_scheduler = Scheduler(
                page        = page,
                title       = 'Scheduler',
                domid       = 'scheduler',
                query       = sq_resource,
                query_all_resources = query_resource_all,
                query_lease = sq_lease,
                )

       # with the new 'Filter' stuff on top, no need for anything but the querytable
        resources_as_list_area = resources_as_list 

        resources_sons = [
            resources_as_gmap, 
            resources_as_3dmap,
            resources_as_scheduler,
            resources_as_list_area,
            ] if do_query_leases else [
            resources_as_gmap, 
            resources_as_3dmap,
            resources_as_list_area,
            ]
        if insert_grid:
            resources_sons.append(resources_as_grid)

        resources_area = Tabs ( page=page, 
                                domid="resources",
                                togglable=True,
                                title="Resources",
                                outline_complete=True,
                                sons= resources_sons,
                                active_domid = 'resources-map',
                                persistent_active=True,
                                )
        main_stack.insert (resources_area)

        # --------------------------------------------------------------------------
        # USERS
    
        if do_query_users and query_user_all is not None:
            tab_users = Tabs(
                page                = page,
                domid               = 'users',
                outline_complete    = True,
                togglable           = True,
                title               = 'Users',
                active_domid        = 'users-list',
                )
            main_stack.insert(tab_users)
    
            tab_users.insert(QueryTable( 
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

# DEMO    
        # --------------------------------------------------------------------------
        # MEASUREMENTS
        measurements_stats_cpu = SliceStat(
            title = "CPU Usage",
            domid = 'resources-stats-cpu',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'cpu'
        )
        
        measurements_stats_mem = SliceStat(
            title = "Memory Usage",
            domid = 'resources-stats-mem',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'mem'
        )
        
        measurements_stats_asb = SliceStat(
            title = "Traffic Sent",
            domid = 'resources-stats-asb',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'asb'
        )
        
        measurements_stats_arb = SliceStat(
            title = "Traffic Received",
            domid = 'resources-stats-arb',
            page  = page,
            stats = 'slice',
            key   = 'hrn',
            query = 'none',
            slicename = slicename,
            o = 'arb'
        )

        tab_measurements = Tabs ( page=page,
                                domid = "measurements",
                                togglable = True,
                                toggled = 'persistent',
                                title = "Measurements",
                                outline_complete=True,
                                sons = [ measurements_stats_cpu, measurements_stats_mem, measurements_stats_asb, measurements_stats_arb ],
                                active_domid = 'resources-stats-cpu',
                                persistent_active = True,
                                )
        main_stack.insert (tab_measurements)
        
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
#        tab_measurements.insert(QueryTable( 
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
        if insert_messages:
            main_stack.insert(Messages(
                    page   = page,
                    title  = "Runtime messages for slice %s"%slicename,
                    domid  = "msgs-pre",
                    levels = "ALL",
                    # plain messages are probably less nice for production but more reliable for development for now
                    transient = False,
                    # these make sense only in non-transient mode..
                    togglable = True,
                    toggled = 'persistent',
                    outline_complete = True,
                    ))
    
        # variables that will get passed to the view-unfold1.html template
        template_env = {}
        
        # define 'unfold_main' to the template engine - the main contents
        template_env [ 'unfold_main' ] = main_stack.render(request)
    
        # more general variables expected in the template
        template_env [ 'title' ] = '%(slicename)s'%locals()
        # the menu items on the top
        template_env [ 'topmenu_items' ] = topmenu_items_live('Slice', page) 
        # so we can sho who is logged
        template_env [ 'username' ] = the_user (request) 
        
        template_env ['theme'] = self.theme
        
        # don't forget to run the requests
        page.expose_js_metadata()
        # the prelude object in page contains a summary of the requirements() for all plugins
        # define {js,css}_{files,chunks}
        template_env.update(page.prelude_env())

        return render_to_response ('view-unfold1.html',template_env,
                                   context_instance=RequestContext(request))
