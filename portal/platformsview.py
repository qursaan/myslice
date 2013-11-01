from manifold.core.query         import Query
from unfold.page                 import Page

from unfold.loginrequired       import FreeAccessView
from ui.topmenu                  import topmenu_items, the_user

from plugins.hazelnut            import Hazelnut

# View for platforms
class PlatformsView(FreeAccessView):
    template_name = "platforms.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)
        page.add_js_files  ( [ "js/common.functions.js" ] )
        platform_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform','platform_longname','gateway_type')
        #platform_query  = Query().get('local:platform').select('platform','platform_longname','gateway_type')
        page.enqueue_query(platform_query)

        page.expose_js_metadata()
        page.expose_queries()
        platformlist = Hazelnut(
            page  = page,
            title = 'List',
            domid = 'checkboxes',
            # this is the query at the core of the slice list
            query = platform_query,
            query_all = platform_query,
            checkboxes = False,
            datatables_options = { 
                'iDisplayLength': 10,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )

        context = super(PlatformsView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['platforms'] = platformlist.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Platforms', self.request)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        context.update(page.prelude_env())

        return context
