from django.views.generic.base   import TemplateView

from manifold.core.query         import Query
from unfold.page                 import Page

from myslice.viewutils           import topmenu_items, the_user

from plugins.hazelnut            import Hazelnut

# View for platforms
class PlatformsView(TemplateView):
    template_name = "platforms.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)

        #network_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform','platform_longname','gateway_type')
        network_query  = Query().get('local:platform').select('platform','platform_longname','gateway_type')
        page.enqueue_query(network_query)

        page.expose_js_metadata()
        page.expose_queries()
        networklist = Hazelnut(
            page  = page,
            title = 'List',
            domid = 'checkboxes',
            # this is the query at the core of the slice list
            query = network_query,
            query_all = network_query,
            checkboxes = False,
            datatables_options = {
            # for now we turn off sorting on the checkboxes columns this way
            # this of course should be automatic in hazelnut
            'aoColumns'      : [None, None, None, None, {'bSortable': False}],
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

        context = super(PlatformsView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['networks'] = networklist.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Platforms connected to MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Platforms', self.request)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        context.update(page.prelude_env())

        return context
