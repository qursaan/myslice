from manifold.core.query         import Query
from unfold.page                 import Page

from unfold.loginrequired        import FreeAccessView
from ui.topmenu                  import topmenu_items_live, the_user

from plugins.querytable          import QueryTable

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
#
#        networklist = SimpleList(
#            title = None,
#            page  = page,
#            key   = 'platform',
#            query = network_query,
#        )

        context = super(PlatformView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['networks'] = networklist.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('Platforms', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        context.update(page.prelude_env())

        return context
