# the supervisor for Plugins
# keeps a handle on all present plugins for managing their queries in a consistent way
# it is expected to exist one such object for a given page

import json

from django.template.loader import render_to_string

from manifold.manifoldapi import ManifoldAPI

from unfold.prelude import Prelude

from myslice.config import Config

# decorator to deflect calls on this Page to its prelude
def to_prelude (method):
    def actual (self, *args, **kwds):
        prelude_method=Prelude.__dict__[method.__name__]
        return prelude_method(self.prelude,*args, **kwds)
    return actual

class Page:

    def __init__ (self, request):
        self.request=request
        # all plugins mentioned in this page
        self._plugins = {}
        # the set of all queries 
        self._queries=set()
        # queue of queries with maybe a domid, see enqueue_query
        self._queue=[]
        # global prelude object
        self.prelude=Prelude(css_files='css/plugin.css')
        # load metadata
        self._metadata={}
        # do not call this uncondionnally as we might not even have logged in
        # self.expose_js_metadata()

    # record known plugins hashed on their domid
    def record_plugin (self, plugin):
        self._plugins[plugin.domid]=plugin

    def get_plugin (self, domid):
        return self._plugins.get(domid,None)
    
    def reset_queue (self):
        self._queries = set()
        self._queue = []

    # the js async methods (see manifold.asynchroneous_success)
    # offer the option to deliver the result to a specific DOM elt
    # otherwise (i.e. if domid not provided) 
    # it goes through the pubsub using query's uuid
    def enqueue_query (self, query, domid=None):
        self._queries = self._queries.union(set( [ query, ] ))
        self._queue.append ( (query.query_uuid,domid,) )

    # return the javascript that triggers all the queries
    # xxx could fruitfully be renamed expose_queries_to_javascript or something
    def exec_queue_asynchroneously (self):
        # compute variables to expose to the template
        env = {}
        # expose the json definition of all queries
        env['queries_jsons'] = [ query.to_json() for query in self._queries ]
        env['query_uuid_domids'] = [ {'query_uuid' : a, 'domid': '"%s"'%b if b else 'null'} for (a,b) in self._queue ]
        javascript = render_to_string ("page-queries.js",env)
        self.reset_queue()
        self.add_js_chunks (javascript)



    def expose_js_metadata(self):
        request=self.request
        # xxx this code should probably not be called unconditionnally at page creation time
        # because we're not sure a user is logged in so we might have no session...
        if 'manifold' not in request.session:
            print "Page.expose_js_metadata: no 'manifold' in session... - skipping"
            return
        # use cached version if present
        if 'metadata' in request.session.keys(): 
            self._metadata = request.session['metadata']
        else:
            manifold_api_session_auth = request.session['manifold']['auth']
            manifold_api = ManifoldAPI(auth=manifold_api_session_auth)
        
            fields = ['table', 'column.column',
                  'column.description','column.header', 'column.title',
                  'column.unit', 'column.info_type',
                  'column.resource_type', 'column.value_type',
                  'column.allowed_values', 'column.platforms.platform',
                  'column.platforms.platform_url']

            results = manifold_api.Get('metadata:table', [], [], fields)

            for res in results:
                 subject = res['table']
                 self._metadata[subject] = res

            request.session['metadata'] = self._metadata

        javascript = "var MANIFOLD_METADATA =" + json.dumps(self._metadata) + ";"
        self.add_js_chunks(javascript)

    def metadata_get_fields(self, subject):
        return self._metadata[subject]['column'].sort()
        
    def expose_js_manifold_config (self):
        self.add_js_chunks(Config.manifold_js_export())

    #################### requirements/prelude management
    # just forward to self.prelude - see decorator above
    @to_prelude
    def add_js_files (self):pass
    @to_prelude
    def add_css_files (self):pass
    @to_prelude
    def add_js_chunks (self):pass
    @to_prelude
    def add_css_chunks (self):pass
    @to_prelude
    def prelude_env (self):pass
