import json
from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_query

from unfold.page                import Page

from plugins.lists.testbedlist  import TestbedList
from plugins.lists.slicelist    import SliceList

from unfold.loginrequired       import FreeAccessView
from unfold.loginrequired       import LoginRequiredAutoLogoutView

from ui.topmenu                 import topmenu_items_live, the_user
from plugins.lists.staticlist	import StaticList
from plugins.lists.slicelist    import SliceList
from plugins.messages		    import Messages
from plugins.querytable         import QueryTable
from plugins.univbrisfoam	    import UnivbrisFoam
from plugins.univbrisfv	 	    import UnivbrisFv
from plugins.univbrisvtam 	    import UnivbrisVtam as UnivbrisVtamPlugin
from plugins.univbrisvtamform 	import UnivbrisVtamForm

#This view requires login 
class UnivbrisVtam (LoginRequiredAutoLogoutView):
    template_name = "univbrisvtam.html"
    
    def get_context_data(self, **kwargs):
        
	page = Page(self.request)
        #print "UNIVBRIS page"
	
	#create new query to manifold----query is not called yet
	#need to modify to get i2cat of resources also
        univbrisvtamform_query=Query().get('ofelia-i2cat-vt:resource').select('hostname')
        #print univbrisfoam_query #.select('urn')
        
	#queue the query
        page.enqueue_query(univbrisvtamform_query)
        page.expose_js_metadata()


	#plugin which display a table where an experimenter will add VMs to according to his needs
        univbrisvtamplugin = UnivbrisVtamPlugin(
            page  = page,
            title = 'univbris_vtam',
            domid = 'univbris_vtam',
            query = None,
        )

	#plugin which display a form where an experimenter will specify where a
        univbrisvtamform = UnivbrisVtamForm(
            page  = page,
            title = 'univbris_vtam_form',
            domid = 'univbris_vtam_form',
	    query = univbrisvtamform_query,
            query_all = None,
            datatables_options = { 
                'iDisplayLength': 3,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
        )
	
	#render plugins in each context within a single page, but not all plugins are visible at all time.
        context = super(UnivbrisVtam, self).get_context_data(**kwargs)
        context['person']   = self.request.user
	#context['welcome'] = univbriswelcome.render(self.request)
        #context['resources'] = univbrisfoamlist.render(self.request)
	context['vms_list']= univbrisvtamplugin.render(self.request)
	context['vm_form']= univbrisvtamform.render(self.request)
	#context['oflowspaces_form']= univbrisofvform.render(self.request)
	#context['flowspaces_form']= univbrisfvform.render(self.request)
	#context['topology']=univbristopology.render(self.request)
	
	
        # XXX This is repeated in all pages
        # more general variables expected in the template
        context['title'] = 'Create New Virtual Machines'
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

