from unfold.plugin import Plugin

class TestbedsPlugin(Plugin):
    
    def __init__ (self, query=None, query_all=None, query_network=None, **settings):
        Plugin.__init__ (self, **settings)

        # Until we have a proper way to access queries in Python
        self.query              = query
        self.query_network      = query_network
        self.query_network_uuid = query_network.query_uuid if query_network else None

        self.query_all          = query_all
        self.query_all_uuid     = query_all.query_uuid if query_all else None

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
        return ['plugin_uuid', 'domid', 'query_uuid', 'query_all_uuid', 'query_network_uuid']

    def export_json_settings (self):
        return True
