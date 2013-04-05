from unfold.plugin import Plugin

class SensLabMap (Plugin):

    # set checkboxes if a final column with checkboxes is desired
    # pass columns as the initial set of columns
    #   if None then this is taken from the query's fields
    def __init__ (self, query, **settings):
        Plugin.__init__ (self, **settings)
        self.query=query

    def template_file (self):
        return "senslabmap.html"

    def template_env (self, request):
        env={}
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/senslabmap.js",
                           "js/spin.presets.js", "js/spin.min.js", "js/jquery.spin.js",
                           "js/three.js", "js/grenoble.js", "js/viewer3D.js",
                           ] ,
            'css_files': [ "css/senslabmap.css" , 
                           ],
            }
        return reqs

    # the list of things passed to the js plugin
    def json_settings_list (self): return ['plugin_uuid','query_uuid']
