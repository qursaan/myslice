import json

from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_query

from unfold.page                import Page
from unfold.loginrequired       import FreeAccessView
from unfold.loginrequired       import LoginRequiredAutoLogoutView
from ui.topmenu                 import topmenu_items_live, the_user

from plugins.lists.testbedlist  import TestbedList
from plugins.lists.slicelist    import SliceList
from plugins.querytable         import QueryTable
from plugins.univbrisfoam       import UnivbrisFoam
from plugins.univbrisfv         import UnivbrisFv
from plugins.lists.staticlist   import StaticList
from plugins.lists.slicelist    import SliceList
from plugins.messages           import Messages
from plugins.univbrisfvf        import UnivbrisFvf

#This view requires login 
class UnivbrisView (LoginRequiredAutoLogoutView):
#class UnivbrisView (FreeAccessView):
    template_name = "univbris.html"
    
    def get_context_data(self, **kwargs):
        
        page = Page(self.request)
        #print "UNIVBRIS page"
        
        #create new query to manifold----query is not called yet
        #need to modify to get i2cat of resources also
        univbrisfoam_query=Query().get('ofelia-bristol-of:resource').select('urn')
            
        #queue the query
        page.enqueue_query(univbrisfoam_query)
        page.expose_js_metadata()
        
        #plugin which collects different openflow ports from maniford
        univbrisfoamlist = UnivbrisFoam(
            page  = page,
            title = 'univbris_foam_ports_selection',
            domid = 'univbris_foam_ports_selection',
            query = univbrisfoam_query,
            query_all = univbrisfoam_query,
            checkboxes = False,
            datatables_options = { 
                'iDisplayLength': 10,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )
    
        #plugin which manages the different flowspaces that the user creates, and also sends flowspaces to manifold
        univbrisfvlist = UnivbrisFv(
                page  = page,
                title = 'univbris_flowspace_selection',
                domid = 'univbris_flowspace_selection',
            query = None,
                query_all = None,
                datatables_options = { 
                    'iDisplayLength': 5,
                    'bLengthChange' : True,
                    'bAutoWidth'    : True,
                    },
            )
    
        #plugin which allows the definition of a single flowspace
        univbrisfvform = UnivbrisFvf(
                page  = page,
                title = 'univbris_flowspace_form',
                domid = 'univbris_flowspace_form',
            query = None,
                query_all = None,
                datatables_options = { 
                    'iDisplayLength': 3,
                    'bLengthChange' : True,
                    'bAutoWidth'    : True,
                    },
            )
        
        #render plugins in each context within a single page, but not all plugins are visible at all time.
        context = super(UnivbrisView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['resources'] = univbrisfoamlist.render(self.request)
        context['flowspaces']= univbrisfvlist.render(self.request)
        context['flowspaces_form']= univbrisfvform.render(self.request)
    
        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Book OpenFlow resources'
        # the menu items on the top
        context['topmenu_items'] = topmenu_items_live('univbris', page)
        # so we can sho who is logged
        context['username'] = the_user(self.request)
    
        context.update(page.prelude_env())
        page.expose_js_metadata()
        
    
        # the page header and other stuff
        context.update(page.prelude_env())
    
        context['layout_1_or_2']="layout-unfold2.html" if not context['username'] else "layout-unfold1.html"
    
        return context

