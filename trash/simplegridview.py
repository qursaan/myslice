# just one instance of QueryGrid, nothing more, nothing less
from django.views.generic.base import TemplateView
from django.template import RequestContext
from django.shortcuts import render_to_response

from manifold.core.query import Query, AnalyzedQuery

from unfold.page import Page

from ui.topmenu import topmenu_items, the_user

from plugins.querygrid import QueryGrid

class SimpleGridView (TemplateView):

    def get (self, request, slicename='ple.inria.f14'):

        page=Page(request)
        page.expose_js_metadata()
        metadata = page.get_metadata()
        resource_md = metadata.details_by_object('resource')
        resource_fields = [column['name'] for column in resource_md['column']]

        main_query = Query.get('slice').filter_by('slice_hrn', '=', slicename)
        main_query.select(
                'slice_hrn',
                'resource.hrn', 'resource.hostname', 'resource.type', 
                'resource.network_hrn',
                'lease.urn',
                'user.user_hrn',
                #'application.measurement_point.counter'
        )
        # for internal use in the querygrid plugin;
        # needs to be a unique column present for each returned record
        main_query_key = 'hrn'
    
        query_resource_all = Query.get('resource').select(resource_fields)
        
        aq = AnalyzedQuery(main_query, metadata=metadata)
        page.enqueue_query(main_query, analyzed_query=aq)
        page.enqueue_query(query_resource_all)

        sq_resource    = aq.subquery('resource')

        resources_as_list = QueryGrid( 
            page       = page,
            domid      = 'resources-list',
            title      = 'List view',
            # this is the query at the core of the slice list
            query      = sq_resource,
            query_all  = query_resource_all,
            # safer to use 'hrn' as the internal unique key for this plugin
            id_key     = main_query_key,
            checkboxes = True,
            datatables_options = { 
                'iDisplayLength': 25,
                'bLengthChange' : True,
                'bAutoWidth'    : True,
                },
            )

        # variables that will get passed to the view-unfold1.html template
        template_env = {}
        
        # define 'unfold_main' to the template engine - the main contents
        template_env [ 'unfold_main' ] = resources_as_list.render(request)
    
        # more general variables expected in the template
        template_env [ 'title' ] = 'simple %(slicename)s'%locals()
        # the menu items on the top
        template_env [ 'topmenu_items' ] = topmenu_items('Slice', request) 
        # so we can sho who is logged
        template_env [ 'username' ] = the_user (request) 
    
        # don't forget to run the requests
        page.expose_queries ()

        # the prelude object in page contains a summary of the requirements() for all plugins
        # define {js,css}_{files,chunks}
        prelude_env = page.prelude_env()
        template_env.update(prelude_env)
        result=render_to_response ('view-unfold1.html',template_env,
                                   context_instance=RequestContext(request))
        return result
