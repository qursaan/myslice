import json

from django.template                    import RequestContext
from django.shortcuts                   import render_to_response
from django.views.generic.base          import TemplateView
from django.http import HttpResponse
from django.shortcuts import render

from manifold.core.query                import Query, AnalyzedQuery
from manifoldapi.manifoldapi            import execute_query


from unfold.loginrequired               import LoginRequiredView
from unfold.page                        import Page

from myslice.configengine               import ConfigEngine

from plugins.apply                      import ApplyPlugin
from plugins.querytable                 import QueryTable
from plugins.googlemap                  import GoogleMap
# from plugins.queryupdater               import QueryUpdaterPlugin
from plugins.filter_status              import FilterStatusPlugin
from plugins.testbeds                   import TestbedsPlugin
from plugins.scheduler2                 import Scheduler2

# Bristol plugin
from plugins.univbris                   import Univbris
from plugins.univbrisfoam               import UnivbrisFoam
from plugins.univbrisfv                 import UnivbrisFv
from plugins.univbrisfvf                import UnivbrisFvf
from plugins.univbrisfvfo           	import UnivbrisFvfo
from plugins.univbristopo               import UnivbrisTopo
from plugins.univbrisvtam               import UnivbrisVtam as UnivbrisVtamPlugin
from plugins.univbrisvtamform 	        import UnivbrisVtamForm

from plugins.columns_editor             import ColumnsEditor
from plugins.sladialog                  import SlaDialog
from plugins.lists.simplelist           import SimpleList

from myslice.theme import ThemeView
from myslice.settings import logger

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

        query_resource_all = Query.get('resource').select(resource_fields)
        #page.enqueue_query(query_resource_all)

        # leases query
        #lease_md = metadata.details_by_object('lease')
        #lease_fields = [column['name'] for column in lease_md['column']]

        #query_lease_all = Query.get('lease').select(lease_fields)
        #page.enqueue_query(query_lease_all)

        slice_md = metadata.details_by_object('slice')
        slice_fields = [column['name'] for column in slice_md['column']]
        logger.debug("SLICE RES VIEW fields = {}".format(slice_fields))
        # TODO The query to run is embedded in the URL
        # Example: select slice_hrn, resource.urn, lease.resource, lease.start_time, lease.end_time from slice where slice_hrn == "ple.upmc.myslicedemo"
        main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
        main_query.select(slice_fields)

        # Columns shown by default in Query_table plugin
        page.expose_js_var("QUERYTABLE_MAP","{'Resource name': 'hostname', 'Type': 'type', 'Facility': 'facility_name','Testbed': 'testbed_name', 'Status':'boot_state'}")
       
        # Columns checked by default in Columns_selector plugin
        query_default_fields = ['hostname', 'type', 'facility_name', 'testbed_name', 'boot_state']

        QUERYTABLE_MAP = { 
            'hostname'      :   'Resource name',
            'type'          :   'Type',
            'facility_name' :   'Facility',
            'testbed_name'  :   'Testbed',
            'boot_state'    :   'Status',
        }


        #        # SLICE
        #        'slice_hrn',
        #        # - The record key is needed otherwise the storage of records
        #        #   bugs !
        #        'slice_urn',
        #        # RESOURCES
        #        'resource',
        #        'lease',
        #        'resource.urn',
        #        'resource.hostname', 'resource.type',
        #        # - The facility_name and testbed_name are required for the
        #        #   testbeds plugin to properly work.
        #        'resource.facility_name',
        #        'resource.testbed_name',
        #        # LEASES
        #        'lease.resource',
        #        'lease.start_time',
        #        'lease.end_time',
        #        # - The lease_id is important for NITOS identify already existing
        #        #   leases
        #        'lease.lease_id',

        #        # FLOWSPACE
        #        #'flowspace',
        #        # VMS
        #        #'vms',


        #        #'user.user_hrn',
        #        #'application.measurement_point.counter'
        #)
        # for internal use in the querytable plugin;
        # needs to be a unique column present for each returned record
        main_query_init_key = 'urn'
        aq = AnalyzedQuery(main_query, metadata=metadata)
        page.enqueue_query(main_query, analyzed_query=aq)
        sq_resource    = aq.subquery('resource')
        sq_lease       = aq.subquery('lease')
        #sq_flowspace   = aq.subquery('flowspace')
        #sq_vms         = aq.subquery('vms')

        # --------------------------------------------------------------------------
        # ALL RESOURCES LIST
        # resources as a list using datatable plugin
 
        list_resources     = QueryTable(
            page           = page,
            domid          = 'resources-list',
            title          = 'List view',
            query          = sq_resource,
            query_all      = query_resource_all,
            mapping        = QUERYTABLE_MAP,
            default_fields = query_default_fields,
            init_key       = "urn",
            checkboxes     = True,
            datatables_options = {
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )


        # --------------------------------------------------------------------------
        # RESERVED RESOURCES LIST
        # resources as a list using datatable plugin
 
        list_reserved_resources = SimpleList(
            title = None,
            page  = page,
            key   = 'urn',
            query = sq_resource,
        )

        list_reserved_leases = SimpleList(
            title = None,
            page  = page,
            key   = 'resource',
            query = sq_lease,
        )

#        list_reserved_resources = QueryTable(
#            page       = page,
#            domid      = 'resources-reserved-list',
#            title      = 'List view',
#            query      = sq_resource,
#            query_all  = sq_resource,
#            init_key   = "urn",
#            checkboxes = True,
#            datatables_options = {
#                'iDisplayLength': 25,
#                'bLengthChange' : True,
#                'bAutoWidth'    : True,
#                },
#        )

        # --------------------------------------------------------------------------
        # COLUMNS EDITOR
        # list of fields to be applied on the query 
        # this will add/remove columns in QueryTable plugin
 
        filter_column_editor = ColumnsEditor(
            page  = page,
            query = sq_resource, 
            query_all = query_resource_all,
            default_fields = query_default_fields,
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
            # this key is the one issued by google
            googlemap_api_key = ConfigEngine().googlemap_api_key(),
            # the key to use at init-time
            init_key   = main_query_init_key,
            checkboxes = True,
            
            # To center around Europe : 53,9 / 3
            latitude   = 53.,
            longitude  = 9.,
            zoom       = 3,
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
            query_lease = sq_lease,
        )

        # --------------------------------------------------------------------------
        # QueryUpdater (Pending Operations)
 
#         pending_resources = QueryUpdaterPlugin(
#             page                = page,
#             title               = 'Pending operations',
#             query               = main_query,
#             togglable           = False,
#             # start turned off, it will open up itself when stuff comes in
#             toggled             = False,
#             domid               = 'pending',
#             outline_complete    = True,
#             username            = request.user,
#         )

        # --------------------------------------------------------------------------
        # NETWORKS
        # testbeds as a list of filters 

        network_md = metadata.details_by_object('network')
        network_fields = [column['name'] for column in network_md['column']]

        #query_networks = Query.get('network').select(network_fields)
        #page.enqueue_query(query_networks)

        filter_testbeds = TestbedsPlugin(
            page            = page,
            domid           = 'testbeds-filter',
            title           = 'Filter by testbeds',
            query           = sq_resource,
            #query_networks  = query_networks,
            #init_key        = "network_hrn",
            #checkboxes      = True,
            #datatables_options = {
            #    'iDisplayLength': 25,
            #    'bLengthChange' : True,
            #    'bAutoWidth'    : True,
            #    },
        )

        filter_status = FilterStatusPlugin(
            page            = page,
            domid           = "filter-status",
            query           = sq_resource,
            query_lease     = sq_lease,
        )
        apply = ApplyPlugin(
            page            = page,
            domid           = "apply",
            query           = main_query,
            username            = request.user,
        )
            
        # --------------------------------------------------------------------------
        # Ofelia OpenFlow Plugin 
        # Bristol plugin

    	# plugin which display a "gathering resources" message 
        # waiting for all resources to be returned by manifold
       # univbriswelcome = Univbris(
       #     page  = page,
       #     title = 'univbris_welcome',
       #     domid = 'univbris_welcome',
       #     query = query_resource_all,
       # )

       # univbrisfoamlist = UnivbrisFoam(
       #     page  = page,
       #     title = 'univbris_foam_ports_selection',
       #     domid = 'univbris_foam_ports_selection',
       #     query = query_resource_all,
       #     query_all = query_resource_all,
       #     checkboxes = False,
       #     datatables_options = {
       #         'iDisplayLength': 10,
       #         'bLengthChange' : True,
       #         'bAutoWidth'    : True,
       #         },
       # )

       # #plugin which manages the different flowspaces that the user creates, and also sends flowspaces to manifold
       # univbrisfvlist = UnivbrisFv(
       #         page  = page,
       #         title = 'univbris_flowspace_selection',
       #         domid = 'univbris_flowspace_selection',
       #         query = sq_flowspace,
       #         query_all = query_resource_all,
       #         datatables_options = {
       #             'iDisplayLength': 5,
       #             'bLengthChange' : True,
       #             'bAutoWidth'    : True,
       #             },
       # )

       # #plugin which allows the definition of a single flowspace
       # univbrisfvform = UnivbrisFvf(
       #         page  = page,
       #         title = 'univbris_flowspace_form',
       #         domid = 'univbris_flowspace_form',
       #         query = query_resource_all,
       #         query_all = None,
       #         datatables_options = {
       #             'iDisplayLength': 3,
       #             'bLengthChange' : True,
       #             'bAutoWidth'    : True,
       #             },
       # )

	   # #plugin which allows the definition the match criteria on a single OPTICAL flowspace
       # univbrisofvform = UnivbrisFvfo(
       #     page  = page,
       #     title = 'univbris_oflowspace_form',
       #     domid = 'univbris_oflowspace_form',
	   #     query = None,
       #     query_all = None,
       #     datatables_options = { 
       #         'iDisplayLength': 3,
       #         'bLengthChange' : True,
       #         'bAutoWidth'    : True,
       #         },
       # )

       # #plugin which display the gathered topology
       # univbristopology = UnivbrisTopo(
       #     page  = page,
       #     title = 'univbris_topology',
       #     domid = 'univbris_topology',
       #     query = query_resource_all,
       # )

       # # --------------------------------------------------------------------------
       # # Ofelia VTAM Plugin 
       # # Bristol Plugin

       # #plugin which display a table where an experimenter will add VMs to according to his needs
       # # responsible to send the data to Manifold
       # univbrisvtamplugin = UnivbrisVtamPlugin(
       #     page  = page,
       #     title = 'univbris_vtam',
       #     domid = 'univbris_vtam',
       #     query = sq_vms,
       #     #query = sq_resource,
       # )

       # #plugin which display a form where an experimenter will specify 
       # # in which testbed and which physical server to setup the VM
       # univbrisvtamform = UnivbrisVtamForm(
       #     page  = page,
       #     title = 'univbris_vtam_form',
       #     domid = 'univbris_vtam_form',
	   #     query =  query_resource_all,
       #     query_all = None,
       #     datatables_options = { 
       #         'iDisplayLength': 3,
       #         'bLengthChange' : True,
       #         'bAutoWidth'    : True,
       #         },
       # )

       # # --------------------------------------------------------------------------
       # # SLA View and accept dialog
       # 
       # sla_dialog = SlaDialog(
       #     page                = page,
       #     title               = 'sla dialog',
       #     query               = main_query,
       #     togglable           = False,
       #     # start turned off, it will open up itself when stuff comes in
       #     toggled             = True,
       #     domid               = 'sla_dialog',
       #     outline_complete    = True,
       #     username            = request.user,
       # )
       # 
        ## check user is pi or not
        platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')
        platform_details = execute_query(self.request, platform_query)
        account_details = execute_query(self.request, account_query)

        # XXX When session has expired, this is None and thus not iterable
        for platform_detail in platform_details:
            for account_detail in account_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    if 'config' in account_detail and account_detail['config'] is not '':
                        account_config = json.loads(account_detail['config'])
                        if 'myslice' in platform_detail['platform']:
                            acc_auth_cred = account_config.get('delegated_authority_credentials','N/A')
        # assigning values
        if acc_auth_cred == {} or acc_auth_cred == 'N/A':
            pi = "is_not_pi"
        else:
            pi = "is_pi"
        
        template_env = {}
        template_env['list_resources'] = list_resources.render(self.request)
        template_env['list_reserved_resources'] = list_reserved_resources.render(self.request)
        template_env['list_reserved_leases'] = list_reserved_leases.render(self.request)

        template_env['columns_editor'] = filter_column_editor.render(self.request)

        template_env['filter_testbeds'] = filter_testbeds.render(self.request)
        template_env['filter_status'] = filter_status.render(self.request)
        template_env['apply'] = apply.render(self.request)

        template_env['map_resources'] = map_resources.render(self.request)
        template_env['scheduler'] = resources_as_scheduler2.render(self.request)

        # Bristol plugin
       # template_env['welcome'] = univbriswelcome.render(self.request)
       # template_env['resources'] = univbrisfoamlist.render(self.request)
       # template_env['flowspaces'] = univbrisfvlist.render(self.request)
       # template_env['oflowspaces_form'] = univbrisofvform.render(self.request)
       # template_env['flowspaces_form'] = univbrisfvform.render(self.request)
       # template_env['topology'] = univbristopology.render(self.request)
       # template_env['vms_list'] = univbrisvtamplugin.render(self.request)
       # template_env['vm_form'] = univbrisvtamform.render(self.request)

#        template_env['pending_resources'] = pending_resources.render(self.request)
       # template_env['sla_dialog'] = '' # sla_dialog.render(self.request)
        template_env["theme"] = self.theme
        template_env["username"] = request.user
        template_env["pi"] = pi
        template_env["slice"] = slicename
        template_env["section"] = "resources"
        template_env["msg"] = msg
        template_env.update(page.prelude_env())

        return render_to_response(self.template, template_env, context_instance=RequestContext(request))
