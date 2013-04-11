from unfold.plugin import Plugin

# lists levels and sets them to enabled or not at startup
default_levels = {'fatal': True, 'error': True, 'warning' : True, 'info' : True, 'debug' : False}

class Messages (Plugin):

    def __init__ (self, levels=None, **settings):
        Plugin.__init__ (self, **settings)
        if levels is None: levels=default_levels
        # shortcut: 'ALL' turn everything on
        elif levels=='ALL': levels=dict( [ (k,True) for k in default_levels ] )
        elif levels=='NONE': levels=dict( [ (k,False) for k in default_levels ] )
        self.levels=levels

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
        return [ 'plugin_uuid', 'levels' ]

    # and we don't need a spin wheel 
    def start_with_spin (self):
        return False
