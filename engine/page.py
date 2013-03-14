# the supervisor for Plugins
# keeps a handle on all present plugins for managing their queries in a consistent way
# it is expected to exist one such object for a given page

import json

from engine.prelude import Prelude
from engine.manifoldapi import ManifoldAPI
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
        # queue of queries
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
        self._queue = []

    # the js async methods (see manifold_async_success)
    # offer the option to deliver the result to a specific DOM elt
    # otherwise (i.e. if domid not provided) 
    # it goes through the pubsub using query's uuid
    def enqueue_query (self, query, domid=None):
        self._queue.append ( (query,domid,) )

    # return the javascript that triggers all the queries
    def exec_queue_asynchroneously (self):
        js = ""
        js += "var async_queries = new Array();\n"
        for (query,domid) in self._queue:
            qjson=query.to_json()
            id="'%s'"%domid if domid else 'undefined'
            js += "async_queries.push({'query':%(qjson)s, 'id':%(id)s});\n"%locals()
        js += "onFunctionAvailable('manifold_async_exec', function() {manifold_async_exec(async_queries);}, this, true);"
        self.reset_queue()
        # run only once the document is ready
        js = "$(document).ready(function(){%(js)s})"%locals()
        self.add_js_chunks (js)


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
                 method = res['table']
                 self._metadata[method] = res

            request.session['metadata'] = self._metadata

        javascript = "all_headers=" + json.dumps(self._metadata) + ";"
        self.add_js_chunks(javascript)

    def metadata_get_fields(self, method):
        return self._metadata[method]['column'].sort()
        
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
    def template_env (self):pass
