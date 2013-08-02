from unfold.plugin import Plugin

class MyPlugin(Plugin):

    def template_file (self):
        return "myplugin.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/myplugin.js'
            ],
            'css_files': [
                'css/myplugin.css',
            ]
        }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid']

    def export_json_settings (self):
        return True
