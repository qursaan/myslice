from unfold.plugin import Plugin

class CodeEditor(Plugin):

    def template_file(self):
        return "code_editor.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/code_editor.js',
                'js/moo-clientcide-1.3.js',
                'js/codemirror.js',
                'js/sql.js',
                'js/Actions.js',
                #'js/EditorCM.js',
                'js/LayoutCM.js',
            ] ,
            'css_files': [
                'css/codemirror.css',
            ]
        }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 'lineNumbers']

    def export_json_settings (self):
        return True
