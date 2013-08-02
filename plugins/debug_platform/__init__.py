from unfold.plugin       import Plugin
from unfold.page         import Page
from plugins.code_editor import CodeEditor
from plugins.hazelnut.hazelnut import Hazelnut

class DebugPlatform(Plugin):

    def template_file(self):
        return "debug_platform.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/debug_platform.js',
            ] ,
            'css_files': [
                'css/debug_platform.css',
            ]
        }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid']

    def export_json_settings (self):
        return True

    def template_env (self, request):
        # This part should be moved to a Layout
        env = {}
        env['topleft'] = CodeEditor(page=self.page, lineNumbers=True).render(request)
        env['bottomleft'] = Hazelnut(page=self.page, columns=['dummy']).render(request)
        return env

