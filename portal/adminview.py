from manifold.core.query        import Query
from unfold.page                import Page

from ui.topmenu                 import topmenu_items_live, the_user
from manifold.manifoldapi       import execute_admin_query

from plugins.querytable         import QueryTable
from unfold.loginrequired       import LoginRequiredAutoLogoutView


# View for platforms
class AdminView(LoginRequiredAutoLogoutView):
    template_name = "adminview.html"

    def get_context_data(self, **kwargs):
        page = Page(self.request)
        page.add_js_files  ( [ "js/common.functions.js" ] )
        #platform_query  = Query().get('local:platform').filter_by('disabled', '==', '0').select('platform','platform_longname','gateway_type')
        #platform_query  = Query().get('local:platform').select('platform','platform_longname','gateway_type')
        email_list = []
        status_list = []
        user_query  = Query().get('local:user').select('email','status')
        user_details = execute_admin_query(self.request, user_query)
        for user in user_details:
            email_list.append(user['email'])
            status_list.append(user['status'])

        user_list = [{'email': t[0], 'status': t[1]}
            for t in zip(email_list, status_list)]

            
        #page.enqueue_query(user_query)

        #page.expose_js_metadata()
        #userlist = QueryTable(
        #    page  = page,
        #    title = 'List',
        #    domid = 'checkboxes',
        #    # this is the query at the core of the slice list
        #    query = user_query,
        #    query_all = user_query,
        #    checkboxes = False,
        #    init_key   = 'user',
        #    datatables_options = { 
        #        'iDisplayLength': 10,
        #        'bLengthChange' : True,
        #        'bAutoWidth'    : True,
        #        },
        #)

        context = super(AdminView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['user_list'] = user_list

        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Users in MySlice'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('Admin', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)

        context.update(page.prelude_env())

        context['layout_1_or_2']="layout-unfold2.html" if not context['username'] else "layout-unfold1.html"

        return context
