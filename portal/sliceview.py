from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from portal.templateviews            import LoginRequiredAutoLogoutView

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery

from myslice.viewutils               import topmenu_items, the_user

from plugins.raw.raw                 import Raw
from plugins.stack.stack             import Stack
from plugins.tabs.tabs               import Tabs
from plugins.hazelnut                import Hazelnut 
from plugins.resources_selected      import ResourcesSelected
from plugins.googlemaps              import GoogleMaps
from plugins.senslabmap.senslabmap   import SensLabMap
from plugins.querycode.querycode     import QueryCode
from plugins.query_editor            import QueryEditor
from plugins.active_filters          import ActiveFilters
from plugins.quickfilter.quickfilter import QuickFilter
from plugins.messages.messages       import Messages
#from plugins.updater                 import Updater

tmp_default_slice='ple.upmc.myslicedemo'

class SliceView (LoginRequiredAutoLogoutView):

    def get (self,request, slicename=tmp_default_slice):
    
        page = Page(request)
        page.add_css_files ('css/slice-view.css')
        page.add_js_chunks ('$(function() { console.log("sliceview: jQuery version " + $.fn.jquery); });')
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
                'resource.resource_hrn', 'resource.hostname', 'resource.type', 'resource.network_hrn',
                #'lease.urn',
                'user.user_hrn',
                #'application.measurement_point.counter'
        )
    
        query_resource_all = Query.get('resource').select(resource_fields)
        query_user_all = Query.get('user').select(user_fields)
    
        aq = AnalyzedQuery(main_query, metadata=metadata)
        page.enqueue_query(main_query, analyzed_query=aq)
        page.enqueue_query(query_resource_all)
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
        # ResourcesSelected
        #
        main_stack.insert(ResourcesSelected(
            page                = page,
            title               = 'Pending operations',
            query               = main_query,
            togglable           = True,
            domid               = 'pending',
            outline_complete    = True,
        ))
    
#        main_stack.insert(
#            Raw (page=page,togglable=False, toggled=True,html='<b>Description:</b> TODO')
#        )
    
        # the resources part is made of a Stack, 
        # with first a Tabs (List, Geographic), 
        # and second the QueryEditor to tweak the set of attributes to show
        resources_as_list = Hazelnut( 
            page       = page,
            title      = 'Resources as a List',
            domid      = 'checkboxes',
            # this is the query at the core of the slice list
            query      = sq_resource,
            query_all  = query_resource_all,
            checkboxes = True,
            datatables_options = { 
                # for now we turn off sorting on the checkboxes columns this way
                # this of course should be automatic in hazelnut
                'aoColumns'      : [None, None, None, None, {'bSortable': False}],
                'iDisplayLength' : 25,
                'bLengthChange'  : True,
                },
            )

        resources_as_map = GoogleMaps(
            page       = page,
            title      = 'Geographic view',
            domid      = 'gmap',
            # tab's sons preferably turn this off
            togglable  = False,
            query      = sq_resource,
            query_all  = query_resource_all,
            checkboxes = True,
            # center on Paris
            latitude   = 49.,
            longitude  = 2.2,
            zoom       = 3,
        )

        resources_query_editor = QueryEditor(
            page  = page,
            query = sq_resource,
            )
        resources_active_filters = ActiveFilters(
            page  = page,
            query = sq_resource,
            )

        resources_area = Stack (
            page=page,
            domid="resources",
            togglable=True,
            title="Resources",
            outline_complete=True,
            sons = [
                Tabs ( page=page, 
                       sons=[ resources_as_list, resources_as_map, ] 
                       ),
                Stack ( page=page,
                        title="Customize",
                        togglable=True,
                        sons = [ resources_query_editor, resources_active_filters, ]
                        ),
                ]
            )

        main_stack.insert (resources_area)


#        sq_plugin = Tabs (
#            page=page,
#            title="Slice view for %s"%slicename,
#            togglable=True,
#            sons=[],
#        )
    
    
        ############################################################################
        # RESOURCES
        # 
        # A stack inserted in the subquery tab that will hold all operations
        # related to resources
        # 
        
#        stack_resources = Stack(
#            page = page,
#            title = 'Resources',
#            sons=[],
#        )
    
#        stack_resources.insert(resource_active_filters)
#    
#    
#        stack_resources.insert(tab_resource_plugins)
    
#        sq_plugin.insert(stack_resources)
    
        ############################################################################
        # USERS
        # 
    
        tab_users = Tabs(
            page                = page,
            domid               = 'users',
            outline_complete    = True,
            togglable           = True,
            title               = 'Users',
            active_domid        = 'checkboxes2',
        )
        main_stack.insert(tab_users)
    
#        tab_users.insert(Hazelnut( 
#            page        = page,
#            title       = 'Users List',
#            domid       = 'checkboxes2',
#            # tab's sons preferably turn this off
#            togglable   = False,
#            # this is the query at the core of the slice list
#            query       = sq_user,
#            query_all  = query_user_all,
#            checkboxes  = True,
#            datatables_options = { 
#                # for now we turn off sorting on the checkboxes columns this way
#                # this of course should be automatic in hazelnut
#                'aoColumns'      : [None, None, None, None, {'bSortable': False}],
#                'iDisplayLength' : 25,
#                'bLengthChange'  : True,
#            },
#        ))
    
        tab_measurements = Tabs (
            page                = page,
            active_domid        = 'checkboxes3',
            outline_complete    = True,
            togglable           = True,
            title               = 'Measurements',
            domid               = 'measurements',
        )
        main_stack.insert(tab_measurements)
    
        tab_measurements.insert(Hazelnut( 
            page        = page,
            title       = 'Measurements',
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
