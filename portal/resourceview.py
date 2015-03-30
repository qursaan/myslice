from __future__ import print_function

from manifold.core.query        import Query
from unfold.page                import Page

from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items_live, the_user

from plugins.googlemap          import GoogleMap
from plugins.querytable         import QueryTable
from plugins.lists.simplelist   import SimpleList
from plugins.slicestat          import SliceStat

from myslice.configengine       import ConfigEngine
from myslice.theme import ThemeView

# View for 1 platform and its details
class ResourceView(FreeAccessView, ThemeView):
    template_name = "resource.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)
        
        page.add_js_files  ( [ "js/common.functions.js" ] )

        for key, value in kwargs.iteritems():
            print("%s = %s" % (key, value))       
            if key == "urn":
                resource_urn=value
                
        resource_query  = Query().get('resource')\
            .filter_by('urn', '==', resource_urn)\
            .select('hostname','type','hrn','urn', 'latitude', 'longitude', 'country')
        page.enqueue_query(resource_query)

        page.expose_js_metadata()

        resourcelist = QueryTable(
            page  = page,
            title = 'List',
            domid = 'checkboxes',
            # this is the query at the core of the slice list
            query = resource_query,
            query_all = resource_query,
            checkboxes = False,
            datatables_options = {
            'iDisplayLength' : 25,
            'bLengthChange'  : True,
            },
        )
        resource_as_map = GoogleMap(
            page       = page,
            title      = 'Geographic view',
            domid      = 'resources-map',
            # tab's sons preferably turn this off
            togglable  = True,
            query      = resource_query,
            query_all  = resource_query,
            googlemap_api_key = ConfigEngine().googlemap_api_key(),
            checkboxes = False,
            # center on Paris
            #latitude   = 49.,
            #longitude  = 9,
            #zoom       = 4,
        )
#        resourcelist = SimpleList(
#            title = None,
#            page  = page,
#            key   = 'hrn',
#            query = resource_query,
#        )

        resource_stats = SliceStat(
            title = None,
            page  = page,
            stats = 'node',
            key   = 'hrn',
            query = resource_query
        )

        context = super(ResourceView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['resource'] = resourcelist.render(self.request)
        context['resource_as_map'] = resource_as_map.render(self.request)
        context['resource_stats'] = resource_stats.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Information about a resource'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live(None, page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)
        context['theme'] = self.theme
        context.update(page.prelude_env())

        return context



