from django.template import RequestContext
from django.shortcuts import render_to_response

from unfold.page import Page
from myslice.viewutils import topmenu_items, the_user

class PortalPage(Page):
    def __init__(self, request):
        Page.__init__(self, request)
        self._content = []

    def __lshift__(self, content):
        self._content.append(content)

    def render(self):
        template_env = {}
        
        # define 'unfold1_main' to the template engine - the main contents
        template_env [ 'unfold1_main' ] = "\n".join(self._content)

        # more general variables expected in the template
        template_env [ 'title' ] = 'Test view that combines various plugins'
        # the menu items on the top
        template_env [ 'topmenu_items' ] = topmenu_items('slice', self.request) 
        # so we can sho who is logged
        template_env [ 'username' ] = the_user (self.request) 

        # don't forget to run the requests
        # Jordan: it seems we need this to init plugins js
        # Issue a "manifold is not defined" error
        #self.expose_queries ()

        template_env.update(self.prelude_env())
        result=render_to_response ('view-unfold1.html',template_env,
                                   context_instance=RequestContext(self.request))
        return result
