from unfold.plugin import Plugin

class FilterStatusPlugin(Plugin):
    
    def __init__ (self, query=None, query_lease=None, **settings):
        Plugin.__init__ (self, **settings)
        self.query              = query

        self.query_lease = query_lease
        self.query_lease_uuid = query_lease.query_uuid

    def template_file (self):
        return "filter_status.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/filter_status.js'
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
        return ['plugin_uuid', 'domid', 'query_uuid', 'query_lease_uuid']

    def export_json_settings (self):
        return True
