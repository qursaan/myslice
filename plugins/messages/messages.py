from unfold.plugin import Plugin

class Messages (Plugin):

    def __init__ (self, **settings):
        Plugin.__init__ (self, **settings)

    def template_file (self):
        return "messages.html"

    def requirements (self):
        return {
            'js_files' :  [ "js/messages.js", "js/manifold.js", ],
            'css_files' : "css/messages.css",
            }

    # although this has no query, we need a plugin instance to be created in the js output
    def export_json_settings (self):
        return True
    # the js plugin expects a domid
    def json_settings_list (self):
        return [ 'plugin_uuid' ]

    # and we don't need a spin wheel 
    def start_with_spin (self):
        return False
