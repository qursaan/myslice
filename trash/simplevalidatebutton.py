# just one instance of validator
from django.views.generic.base import TemplateView
from django.template import RequestContext
from django.shortcuts import render_to_response

from manifold.core.query import Query, AnalyzedQuery

from unfold.page import Page

from ui.topmenu import topmenu_items, the_user

from plugins.validatebutton import ValidateButton

class SimpleValidateButtonView (TemplateView):

    # mention a user name in the URL as .../trash/simplevalidatebutton/ple.inria.thierry_parmentelat
    def get (self, request, username='ple.inria.thierry_parmentelat'):

        page=Page(request)
        page.expose_js_metadata()
        query_pi_auths = Query.get('ple:user').filter_by('user_hrn', '==', username ).select('pi_authorities')
        page.enqueue_query(query_pi_auths)

        # even though this plugin does not have any html materialization, the corresponding domid
        # must exist because it is searched at init-time to create the JS plugin
        # so we simply piggy-back the target button here
        validatebutton = ValidateButton (page=page, 
                                         # see above
                                         domid='topmenu-validation',
                                         query=query_pi_auths,
                                         # this one is the target for a $.show() when the query comes back
                                         button_domid="topmenu-validation")

        # variables that will get passed to the view-unfold1.html template
        template_env = {}
        
        # there is a need to call render() for exposing the query and creating the js plugin
        # even though this returns an empty string
        rendered=validatebutton.render(request)

        # write something of our own instead
        template_env ['unfold_main'] = '<h1>Some title </h1>'
        
        # more general variables expected in the template
        template_env [ 'title' ] = 'simple validatebutton %(username)s'%locals()
        # the menu items on the top
        template_env [ 'topmenu_items' ] = topmenu_items('Slice', request) 
        # so we can see who is logged
        template_env [ 'username' ] = the_user (request) 
    
        # don't forget to run the requests
        page.expose_queries ()

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
