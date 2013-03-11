from engine.plugin import Plugin

class SimpleList (Plugin) :

    # only deal with our own stuff here and let Plugin handle the rest
    def __init__ (self, list=[], with_datatables=False, **settings):
        Plugin.__init__ (self, **settings)
        self.list=list
        self.with_datatables = with_datatables

    # SimpleList is useless per se anyways
    def template_file (self): return "simplelist.html"

    def requirements (self):
        reqs = { 'js_files' : [ "js/simplelist.js", "js/plugin.js", "js/query.js", "js/onavail.js",
                                "js/manifold-pubsub.js", "js/manifold-async.js", "spin/spin.all.js", 
] ,
                 'css_files': [ "css/simplelist.css" ],
                 }
        if self.with_datatables:
            reqs['js_files'].append ("datatables/js/dataTables.js")
            reqs['js_files'].append ("js/with-datatables.js")
        return reqs
    
    def json_settings_list (self): return ['plugin_uuid', 'query','query_uuid','key','value']

