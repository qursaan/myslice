# the supervisor for Plugins
# keeps a handle on all present plugins for managing their queries in a consistent way
# it is expected to exist one such object for a given page

from engine.prelude import Prelude

# decorator to deflect calls on this PluginSet to its prelude
def to_prelude (method):
    def actual (self, *args, **kwds):
        prelude_method=Prelude.__dict__[method.__name__]
        return prelude_method(self.prelude,*args, **kwds)
    return actual

class PluginSet:

    def __init__ (self):
        self._plugins = {}
        # queue of queries
        self._queue=[]
        self.prelude=Prelude(css_files='css/plugin.css')
        # no queries yet, needed ?

    # record known plugins hashed on their domid
    def record_plugin (self, plugin):
        self._plugins[plugin.domid]=plugin

    def get_plugin (self, domid):
        return self._plugins.get(domid,None)
    
    def reset_queue (self):
        self._queue = []

    # the js async methods (see manifold_async_success)
    # offer the option to deliver the result to a specific DOM elt
    # otherwise it goes through the pubsub using query's uuid
    def query_enqueue (self, query, domid=None):
        self._queue.append ( (query,domid,) )

    # return the javascript that triggers all the queries
    def exec_queue_asynchroneously (self):
        js = ""
        js += "var manifold_query_array = new Array();"
        for (query,domid) in self._queue:
            qjson=query.to_json()
            id="'%s'"%domid if domid else undefined
            js += "manifold_query_array.push({'query':'%(qjson)s', 'id':%(id)s});"%locals()
        js += "onFunctionAvailable('manifold_async_exec', function() {manifold_async_exec(manifold_query_array);}, this, true);"
        self.reset_queue()
        # run only once the document is ready
        js = "jQuery(function(){%(js)s})"%locals()
        self.prelude.inspect('before add_js_chunks in async')
        self.add_js_chunks (js)
        self.prelude.inspect('after add_js_chunks in async')

    #################### requirements/prelude management
    # just forward to self.pluginset - see decorator above
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
