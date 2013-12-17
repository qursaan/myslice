# just one instance of validator
from django.views.generic.base import TemplateView
from django.template import RequestContext
from django.shortcuts import render_to_response

from manifold.core.query import Query, AnalyzedQuery

from unfold.page import Page

from ui.topmenu import topmenu_items_live, the_user

class TopmenuValidationView (TemplateView):

    # mention a user name in the URL as .../trash/simpletopmenuvalidation/ple.inria.thierry_parmentelat
    def get (self, request, username='ple.inria.thierry_parmentelat'):

        if username=='logged': username='$user_hrn'

        page=Page(request)

        # variables that will get passed to the view-unfold1.html template
        template_env = {}
        
        # write something of our own instead
        template_env ['unfold_main'] = '<h1>Some title </h1>'
        
        # more general variables expected in the template
        template_env [ 'title' ] = 'simple topmenuvalidation %(username)s'%locals()
        # the menu items on the top
        template_env [ 'topmenu_items' ] = topmenu_items_live('Slice', page) 
        # so we can see who is logged
        template_env [ 'username' ] = the_user (request) 
    
        # the prelude object in page contains a summary of the requirements() for all plugins
        # define {js,css}_{files,chunks}
        prelude_env = page.prelude_env()

#        print prelude_env.keys()
#        for k in [ 'js_files' ] :
#            print 'prelude_env',prelude_env,k,prelude_env[k]

        template_env.update(prelude_env)
        result=render_to_response ('view-unfold1.html',template_env,
                                   context_instance=RequestContext(request))
        return result
