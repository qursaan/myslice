from engine.plugin import Plugin

class QueryCode (Plugin):

    def __init__ (self, query, **settings):
        Plugin.__init__ (self, **settings)
        self.query=query
        # our javascript requires the details of the manifold server
        self.page.expose_js_manifold_config()

    def template_file (self):
        return "querycode.html"

    def requirements (self):
        return { 
            'js_files' : [ "js/querycode.js", "js/plugin.js", "js/query.js", "js/onavail.js",
                           "js/manifold-pubsub.js", "js/manifold-async.js", 
                           "js/spin.presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                           
#        Plugins::add_js('/QueryCode/beautyofcode/scripts/shCore.js');
#        Plugins::add_js('/QueryCode/beautyofcode/scripts/shBrushPython.js');
#        Plugins::add_js('/QueryCode/beautyofcode/scripts/shBrushRuby.js');
#        Plugins::add_js('/QueryCode/beautyofcode/scripts/shAutoloader.js');
                           ] ,
            'css_files': [ "css/querycode.css" ,
#        Plugins::add_css('/QueryCode/beautyofcode/styles/shCore.css');
#        Plugins::add_css('/QueryCode/beautyofcode/styles/shCoreDefault.css');
#        Plugins::add_css('/QueryCode/beautyofcode/styles/shThemeDefault.css');
                           ],
            }

    def json_settings_list (self): return ['plugin_uuid', 'query','query_uuid']
        
    # because we have a link to a query it looks like we need a spin, let's make this right
    def start_with_spin (self): return False
