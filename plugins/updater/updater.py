from unfold.plugin import Plugin

class Updater (Plugin):

    def __init__ (self, query, label="Update", **settings):
        Plugin.__init__ (self, **settings)
        # xxx would make sense to check this is a Get query...
        self.query=query
        self.label=label

    def template_file (self):
        return "updater.html"

    def requirements (self):
        return {
            'js_files' :  [ "js/updater.js" , "js/manifold.js", "js/manifold-query.js", ],
            'css_files' : "css/updater.css",
            }

    # although this has no query, we need a plugin instance to be created in the js output
    def export_json_settings (self):     return True
    # the js plugin expects a domid
    def json_settings_list (self):       return [ 'plugin_uuid', 'query_uuid' ]

    # and we don't need a spin wheel 
    def start_with_spin (self):          return False

    def default_togglable (self):        return False
