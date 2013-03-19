from unfold.plugin import Plugin

class SimpleList (Plugin) :

    # only deal with our own stuff here and let Plugin handle the rest
    def __init__ (self, key, with_datatables=False, **settings):
        Plugin.__init__ (self, **settings)
        self.key=key
        self.with_datatables = with_datatables

    # SimpleList is useless per se anyways
    def template_file (self): 
        return "simplelist.html"
    
    def template_env (self, request):
        env={}
        header=getattr(self,'header',None)
        if header: env['header']=header
        env['with_datatables']= "yes" if self.with_datatables else ""
        return env

    def requirements (self):
        reqs = { 'js_files' : [ "js/simplelist.js", "js/plugin.js", "js/manifold-query.js", "js/onavail.js",
                                "js/manifold-pubsub.js", "js/manifold-async.js", "js/manifold-queries.js",
                                "js/spin.presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                                "js/myslice.js",
                                ] ,
                 'css_files': [ "css/simplelist.css" ],
                 }
        if self.with_datatables:
            reqs['js_files'].append ("js/dataTables.js")
            reqs['js_files'].append ("js/with-datatables.js")
        return reqs
    
    def json_settings_list (self): return ['plugin_uuid','query_uuid','key']

