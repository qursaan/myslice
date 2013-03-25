# the supervisor for Plugins
# keeps a handle on all present plugins for managing their queries in a consistent way
# it is expected to exist one such object for a given page

import json

from django.template.loader import render_to_string

from manifold.metadata import MetaData

from unfold.prelude import Prelude

from myslice.config import Config

# decorator to deflect calls on this Page to its prelude
def to_prelude (method):
    def actual (self, *args, **kwds):
        prelude_method=Prelude.__dict__[method.__name__]
        return prelude_method(self.prelude,*args, **kwds)
    return actual

debug=False
debug=True

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
        env['queries_json'] = [ query.to_json() for query in self._queries ]
        env['query_uuid_domids'] = [ {'query_uuid' : a, 'domid': '"%s"'%b if b else 'null'} for (a,b) in self._queue ]
        javascript = render_to_string ("page-queries.js",env)
        self.reset_queue()
        self.add_js_chunks (javascript)


    # needs to be called explicitly and only when metadata is actually required
    # in particular user needs to be logged
    def get_metadata (self):
        # look in session's cache - we don't want to retrieve this for every request
        session=self.request.session
        if 'manifold' not in session:
            print "Page.expose_js_metadata: no 'manifold' in session... - cannot retrieve metadata - skipping"
            return
        manifold=session['manifold']
        # if cached, use it
        if 'metadata' in manifold and isinstance(manifold['metadata'],MetaData):
            if debug: print "Page.get_metadata: return cached value"
            return manifold['metadata']
        # otherwise retrieve it
        manifold_api_session_auth = session['manifold']['auth']
        metadata=MetaData (manifold_api_session_auth)
        metadata.fetch()
            # store it for next time
        manifold['metadata']=metadata
        if debug: print "Page.get_metadata: return new value"
        return metadata
            
    def expose_js_metadata (self):
        # export in this js global...
        self.add_js_chunks("var MANIFOLD_METADATA =" + self.get_metadata().to_json() + ";")

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
