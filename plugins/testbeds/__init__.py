from unfold.plugin import Plugin

class TestbedsPlugin(Plugin):
    
    def __init__ (self, query=None, query_networks=None, **settings):
        Plugin.__init__ (self, **settings)

        # Until we have a proper way to access queries in Python
        self.query              = query
        self.query_networks          = query_networks
        self.query_networks_uuid     = query_networks.query_uuid if query_networks else None

    def template_file (self):
        return "testbeds.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/testbeds.js'
            ],
#            'css_files': [
#                'css/myplugin.css',
#            ]
        }
        return reqs

    def json_settings_list (self):
        # query_uuid will pass self.query results to the javascript
        # and will be available as "record" in :
        # on_new_record: function(record)
        return ['plugin_uuid', 'domid', 'query_uuid', 'query_networks_uuid']

    def export_json_settings (self):
        return True
