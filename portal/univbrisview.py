import json
from manifold.core.query         import Query
from manifoldapi.manifoldapi        import execute_query

from unfold.page                 import Page

from plugins.lists.testbedlist   import TestbedList
from plugins.lists.slicelist     import SliceList

from unfold.loginrequired       import FreeAccessView
from unfold.loginrequired        import LoginRequiredAutoLogoutView

from ui.topmenu                  import topmenu_items_live, the_user
from plugins.querytable          import QueryTable
from plugins.univbrisfoam	 import UnivbrisFoam
from plugins.univbrisfv	 	 import UnivbrisFv
from plugins.lists.staticlist	 import StaticList
from plugins.lists.slicelist     import SliceList
from plugins.messages		import Messages
from plugins.univbrisfvf	import UnivbrisFvf
from plugins.univbrisfvfo	import UnivbrisFvfo
from plugins.univbris		import Univbris
from plugins.univbristopo 	import UnivbrisTopo

#This view requires login 
class UnivbrisView (LoginRequiredAutoLogoutView):
#class UnivbrisView (FreeAccessView):
    template_name = "univbris.html"
    
    def get_context_data(self, **kwargs):
        
        page = Page(self.request)
        metadata = page.get_metadata()
        page.expose_js_metadata()
    
        resource_md = metadata.details_by_object('resource')
        resource_fields = [column['name'] for column in resource_md['column']]
    
        user_md = metadata.details_by_object('user')
        user_fields = ['user_hrn'] # [column['name'] for column in user_md['column']]
    
    
    	#create new query to manifold----query is not called yet
    	#need to modify to get i2cat of resources also
        univbrisfoam_query=Query().get('ofelia-bristol-of:resource').select('urn')
        #print univbrisfoam_query #.select('urn')
    	#Query().get('ofelia-bristol-of:resource')
    	##custom query to communication between univbris plugins
        #univbris_query=Query()
            
    	#queue the query
        page.enqueue_query(univbrisfoam_query)
        #page.enqueue_query(univbris_query)
        page.expose_js_metadata()
    
    
    	#plugin which display a "gathering resources" message waiting for all resources to be returned by manifold
        univbriswelcome = Univbris(
            page  = page,
            title = 'univbris_welcome',
            domid = 'univbris_welcome',
            query = univbrisfoam_query,
        )
    	
    	#plugin which collects different openflow ports from maniford
        univbrisfoamlist = UnivbrisFoam(
            page  = page,
            title = 'univbris_foam_ports_selection',
            domid = 'univbris_foam_ports_selection',
            query = univbrisfoam_query,
            query_all = univbrisfoam_query,
    	    sync_query= univbrisfoam_query,
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
    	    sync_query= univbrisfoam_query,
            datatables_options = { 
                'iDisplayLength': 5,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )
    
    	#plugin which allows the definition the match criteria on a single PACKET flowspace
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
    
    	#plugin which allows the definition the match criteria on a single OPTICAL flowspace
    
        univbrisofvform = UnivbrisFvfo(
                page  = page,
                title = 'univbris_oflowspace_form',
                domid = 'univbris_oflowspace_form',
    	        query = None,
                query_all = None,
                datatables_options = { 
                    'iDisplayLength': 3,
                    'bLengthChange' : True,
                    'bAutoWidth'    : True,
                    },
            )
    
    
    	#plugin which display the gathered topology
        univbristopology = UnivbrisTopo(
                page  = page,
                title = 'univbris_topology',
                domid = 'univbris_topology',
                query = univbrisfoam_query,
            )
    	
    	#render plugins in each context within a single page, but not all plugins are visible at all time.
        context = super(UnivbrisView, self).get_context_data(**kwargs)
        context['person']   = self.request.user
        context['welcome'] = univbriswelcome.render(self.request)
        context['resources'] = univbrisfoamlist.render(self.request)
        context['flowspaces']= univbrisfvlist.render(self.request)
        context['oflowspaces_form']= univbrisofvform.render(self.request)
        context['flowspaces_form']= univbrisfvform.render(self.request)
        context['topology']=univbristopology.render(self.request)
    
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
