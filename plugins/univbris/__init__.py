from unfold.plugin import Plugin

from myslice.settings import logger

class Univbris(Plugin):
    
    def __init__ (self, query=None, **settings):
        Plugin.__init__ (self, **settings)
        self.query=query
        self.query_uuid = query.query_uuid if query else None
        logger.info("called univbris plugin")

    def template_file (self):
        try:
            return "univbris_welcome.html"
        except Exception as e:
            logger.error("error template {}".format(e))

    def requirements (self):
        reqs = {
            'js_files' : [
                "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js",
                "js/manifold.js", "js/manifold-query.js",
                "js/unfold-helper.js",
                'js/univbris.js',
            ],
            'css_files': [
                'css/univbris.css',
            ]
        }
        return reqs

    def json_settings_list (self):
        # query_uuid will pass self.query results to the javascript
        # and will be available as "record" in :
        # on_new_record: function(record)
        return ['plugin_uuid', 'domid', 'query_uuid', 'init_key', ]

    def export_json_settings (self):
        return True
