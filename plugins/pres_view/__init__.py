from unfold.plugin import Plugin

class PresView(Plugin):

    def template_file (self):
        return "pres_view.html"

    def requirements (self):
        reqs = {
            'js_files' : [
                'js/pres_view.js',
                'js/mootools-core.js',
                'js/MooTools.js',
                'js/dynamic.js',
                'js/jquery.min.js',
                'js/jquery-ui.min.js',
                'http://maps.google.com/maps/api/js?sensor=false',
                'js/initmap.js',
                'js/recup_tout_sites.js',
                'js/recup_data.js',
                'js/recup_direct.js',
                'js/recup_liste.js',
                'js/visible.js',
                'js/afficher_par_id.js',           ],
            'css_files': [
                'css/pres_view.css',
                'css/jquery-ui.css'
            ]
        }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid']

    def export_json_settings (self):
        return True
