from manifold.core.query         import Query
from unfold.page                 import Page

from plugins.lists.testbedlist   import TestbedList
from plugins.lists.slicelist     import SliceList

from unfold.loginrequired        import LoginRequiredAutoLogoutView

from ui.topmenu                  import topmenu_items, the_user

#This view requires login 
class DashboardView (LoginRequiredAutoLogoutView):

    template_name = "dashboard.html"
    
    def get_context_data(self, **kwargs):
        # We might have slices on different registries with different user accounts 
        # We note that this portal could be specific to a given registry, to which we register users, but i'm not sure that simplifies things
        # Different registries mean different identities, unless we identify via SFA HRN or have associated the user email to a single hrn

        #messages.info(self.request, 'You have logged in')
        page = Page(self.request)

        # Slow...
        #slice_query = Query().get('slice').filter_by('user.user_hrn', 'contains', user_hrn).select('slice_hrn')
        testbed_query  = Query().get('network').select('network_hrn','platform')
        # DEMO GEC18 Query only PLE
        slice_query = Query().get('user').filter_by('user_hrn', '==', '$user_hrn').select('user_hrn', 'slice.slice_hrn')
        page.enqueue_query(slice_query)
        page.enqueue_query(testbed_query)

        page.expose_js_metadata()
        page.expose_queries()

        slicelist = SliceList(
            page  = page,
            title = "slices",
            query = slice_query,
        )
        testbedlist = TestbedList(
            page  = page,
            title = "testbeds",
            query = testbed_query,
        )
 
        context = super(DashboardView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['testbeds'] = testbedlist.render(self.request) 
        context['slices']   = slicelist.render(self.request)

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Dashboard'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items('Dashboard', self.request) 
        # so we can sho who is logged
        context['username'] = the_user(self.request) 

        context.update(page.prelude_env())

        return context

