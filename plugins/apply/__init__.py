from unfold.plugin import Plugin
from plugins.queryupdater import QueryUpdaterPlugin

class ApplyPlugin(Plugin):
    
    def __init__ (self, query=None, **settings):
        Plugin.__init__ (self, **settings)
        self.query              = query

    def template_file (self):
        return "apply.html"

    def template_env(self, request):
        query_updater = QueryUpdaterPlugin(
            page                = self.page,
            title               = 'Pending operations',
            query               = self.query,
            togglable           = False,
            # start turned off, it will open up itself when stuff comes in
            toggled             = True,
            domid               = 'pending',
            outline_complete    = True,
            username            = request.user, # XXX ???
        )

        env = Plugin.template_env(self, request)
        env.update({'query_updater': query_updater.render(request)})
        return env

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/apply.js'
            ],
            'css_files' : [
                'css/apply.css'
            ],
        }
        return reqs

    def json_settings_list (self):
        # query_uuid will pass self.query results to the javascript
        # and will be available as "record" in :
        # on_new_record: function(record)
        return ['plugin_uuid', 'domid', 'query_uuid']

    def export_json_settings (self):
        return True
