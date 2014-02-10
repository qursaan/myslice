from django.template             import RequestContext
from django.shortcuts            import render_to_response

from manifold.core.query         import Query
from unfold.page                 import Page
from plugins.raw                 import Raw
from plugins.stack               import Stack
from plugins.tabs                import Tabs
from plugins.googlemap           import GoogleMap
from plugins.senslabmap          import SensLabMap

from unfold.loginrequired        import FreeAccessView
from ui.topmenu                  import topmenu_items_live, the_user

from plugins.querytable          import QueryTable

from myslice.configengine        import ConfigEngine

# View for 1 platform and its details
class PlatformView(FreeAccessView):
    template_name = "platform.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)
        page.add_js_files  ( [ "js/common.functions.js" ] )

        for key, value in kwargs.iteritems():
            print "%s = %s" % (key, value)       
            if key == "platformname":
                platformname=value
                
        network_query  = Query().get('local:platform')\
            .filter_by('platform', '==', platformname)\
            .select('platform','platform_longname','gateway_type')
        page.enqueue_query(network_query)

        # ListResources of the platform
        metadata = page.get_metadata()
        resource_md = metadata.details_by_object('resource')
        resource_fields = [column['name'] for column in resource_md['column']]
        resources = platformname + ':resource'
        query_resource_all = Query.get(resources).select(resource_fields)
        page.enqueue_query(query_resource_all)
        query_resource_default_fields = Query.get(resources).select('hrn','hostname', 'type','country')
        page.enqueue_query(query_resource_default_fields)

        page.expose_js_metadata()
        networklist = QueryTable(
            page  = page,
            title = 'List',
            domid = 'checkboxes',
            # this is the query at the core of the slice list
            query = network_query,
            query_all = network_query,
            checkboxes = False,
            datatables_options = {
            'iDisplayLength' : 25,
            'bLengthChange'  : True,
            },
        )

#        networklist = SimpleList(
#            title = None,
#            page  = page,
#            key   = 'platform',
#            query = network_query,
#        )
#
        # --------------------------------------------------------------------------
        # RESOURCES
        # for internal use in the querytable plugin;
        # needs to be a unique column present for each returned record
        main_query_init_key = 'hrn'

        # the resources part is made of a Tabs (Geographic, List), 
        resources_as_gmap = GoogleMap(
            page       = page,
            title      = 'Geographic view',
            domid      = 'resources-map',
            # tab's sons preferably turn this off
            togglable  = False,
            query      = query_resource_default_fields,
            query_all  = query_resource_all,
            # this key is the one issued by google
            googlemap_api_key = ConfigEngine().googlemap_api_key(),
            # the key to use at init-time
            init_key   = main_query_init_key,
            checkboxes = False,
            # center on Paris
            latitude   = 49.,
            longitude  = 9,
            zoom       = 4,
        )
        resources_as_3dmap = SensLabMap(
            page       = page,
            title      = '3D Map',
            domid      = 'senslabmap',
            query      = query_resource_default_fields,
            query_all  = query_resource_all,
        )
        resources_as_list = QueryTable(
            page       = page,
            domid      = 'resources-list',
            title      = 'List view',
            # this is the query at the core of the slice list
            query      = query_resource_default_fields,
            query_all  = query_resource_all,
            init_key     = main_query_init_key,
            checkboxes = False,
            datatables_options = {
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
            )
        resources_sons = [
             resources_as_gmap,
             resources_as_3dmap,
             resources_as_list,
             ]
        resources_area = Tabs ( page=page,
                                domid="resources",
                                togglable=True,
                                title="Resources",
                                outline_complete=True,
                                sons= resources_sons,
                                active_domid = 'resources-map',
                                persistent_active=True,
                                )

        context = super(PlatformView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['networks'] = networklist.render(self.request)
        context['resources'] = resources_area.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('Platforms', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        context.update(page.prelude_env())

        return context
