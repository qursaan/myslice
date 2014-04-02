from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http import HttpResponse
from django.shortcuts import render

from unfold.page                     import Page

from myslice.configengine            import ConfigEngine
from plugins.querytable              import QueryTable
from plugins.googlemap               import GoogleMap
from plugins.queryupdater            import QueryUpdater
from plugins.testbeds                import TestbedsPlugin
from plugins.scheduler2              import Scheduler2
from plugins.columns_editor          import ColumnsEditor

from myslice.theme import ThemeView

class SliceResourceView (LoginRequiredView, ThemeView):
    template_name = "slice-resource-view.html"
    
    def get(self, request, slicename):

        if request.GET.get('message') : 
            msg = "Slice successfully updated"
        else :
            msg = None

        page = Page(request)
        metadata = page.get_metadata()
        page.expose_js_metadata()

        resource_md = metadata.details_by_object('resource')
        resource_fields = [column['name'] for column in resource_md['column']]

        user_md = metadata.details_by_object('user')
        user_fields = ['user_hrn'] # [column['name'] for column in user_md['column']]

        # TODO The query to run is embedded in the URL
        main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
        main_query.select(
                'slice_hrn',
                'resource.urn', 
                'resource.hostname', 'resource.type',
                'resource.network_hrn',
                'lease.urn',
                'user.user_hrn',
                #'application.measurement_point.counter'
        )
        # for internal use in the querytable plugin;
        # needs to be a unique column present for each returned record
        main_query_init_key = 'urn'
        aq = AnalyzedQuery(main_query, metadata=metadata)
        page.enqueue_query(main_query, analyzed_query=aq)
        sq_resource    = aq.subquery('resource')
        sq_lease       = aq.subquery('lease')

        query_resource_all = Query.get('resource').select(resource_fields)
        page.enqueue_query(query_resource_all)

        # leases query
        lease_md = metadata.details_by_object('lease')
        lease_fields = [column['name'] for column in lease_md['column']]

        query_all_lease = Query.get('lease').select(lease_fields)
        page.enqueue_query(query_all_lease)

        # --------------------------------------------------------------------------
        # ALL RESOURCES LIST
        # resources as a list using datatable plugin
 
        list_resources = QueryTable(
            page       = page,
            domid      = 'resources-list',
            title      = 'List view',
            query      = sq_resource,
            query_all  = query_resource_all,
            init_key   = "urn",
            checkboxes = True,
            datatables_options = {
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )


        # --------------------------------------------------------------------------
        # RESERVED RESOURCES LIST
        # resources as a list using datatable plugin
 
        list_reserved_resources = QueryTable(
            page       = page,
            domid      = 'resources-reserved-list',
            title      = 'List view',
            query      = sq_resource,
            query_all  = sq_resource,
            init_key   = "urn",
            checkboxes = True,
            datatables_options = {
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )

        # --------------------------------------------------------------------------
        # COLUMNS EDITOR
        # list of fields to be applied on the query 
        # this will add/remove columns in QueryTable plugin
 
        filter_column_editor = ColumnsEditor(
            page  = page,
            query = sq_resource, 
            query_all = query_resource_all,
            title = "Select Columns",
            domid = 'select-columns',
        )

        # --------------------------------------------------------------------------
        # RESOURCES MAP
        # the resources part is made of a Tabs (Geographic, List), 

        map_resources  = GoogleMap(
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
            zoom       = 8,
        )

        # --------------------------------------------------------------------------
        # LEASES Nitos Scheduler
        # Display the leases reservation timeslots of the resources

        resources_as_scheduler2 = Scheduler2( 
            page       = page,
            domid      = 'scheduler',
            title      = 'Scheduler',
            # this is the query at the core of the slice list
            query = sq_resource,
            query_all_resources = query_resource_all,
            query_lease = query_all_lease,
        )

        # --------------------------------------------------------------------------
        # QueryUpdater (Pending Operations)
 
        pending_resources = QueryUpdater(
            page                = page,
            title               = 'Pending operations',
            query               = main_query,
            togglable           = True,
            # start turned off, it will open up itself when stuff comes in
            toggled             = False,
            domid               = 'pending',
            outline_complete    = True,
        )

        # --------------------------------------------------------------------------
        # NETWORKS
        # testbeds as a list of filters 

        network_md = metadata.details_by_object('network')
        network_fields = [column['name'] for column in network_md['column']]

        query_network = Query.get('network').select(network_fields)
        page.enqueue_query(query_network)

        filter_testbeds = TestbedsPlugin(
            page          = page,
            domid         = 'testbeds-filter',
            title         = 'Filter by testbeds',
            query         = sq_resource,
            query_all     = query_resource_all,
            query_network = query_network,
            init_key      = "network_hrn",
            checkboxes    = True,
            datatables_options = {
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )

        template_env = {}
        template_env['list_resources'] = list_resources.render(self.request)
        template_env['list_reserved_resources'] = list_reserved_resources.render(self.request)

        template_env['columns_editor'] = filter_column_editor.render(self.request)

        template_env['filter_testbeds'] = filter_testbeds.render(self.request)
        template_env['map_resources'] = map_resources.render(self.request)
        template_env['scheduler'] = resources_as_scheduler2.render(self.request)
        template_env['pending_resources'] = pending_resources.render(self.request)
        template_env["theme"] = self.theme
        template_env["username"] = request.user
        template_env["slice"] = slicename
        template_env["section"] = "resources"
        template_env["msg"] = msg
        template_env.update(page.prelude_env())

        return render_to_response(self.template, template_env, context_instance=RequestContext(request))
