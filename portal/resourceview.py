from django.views.generic.base   import TemplateView

from manifold.core.query         import Query
from unfold.page                 import Page

from ui.topmenu                  import topmenu_items, the_user

from plugins.googlemap           import GoogleMap
from plugins.hazelnut            import Hazelnut
from plugins.lists.simplelist    import SimpleList
from plugins.slicestat           import Slicestat

# View for 1 platform and its details
class ResourceView(TemplateView):
    template_name = "resource.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)

        for key, value in kwargs.iteritems():
            print "%s = %s" % (key, value)       
            if key == "urn":
                resource_urn=value
                
        resource_query  = Query().get('resource')\
            .filter_by('urn', '==', resource_urn)\
            .select('hostname','type','hrn','urn', 'latitude', 'longitude', 'country')
        page.enqueue_query(resource_query)

        page.expose_js_metadata()
        page.expose_queries()

        resourcelist = Hazelnut(
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

        resource_stats = Slicestat(
            title = None,
            page  = page,
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
        context['topmenu_items'] = topmenu_items(None, self.request)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        context.update(page.prelude_env())

        return context



