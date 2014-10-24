from unfold.plugin import Plugin

class UnivbrisVtamForm (Plugin):

    def __init__ (self, query=None, query_all=None, 
                  checkboxes=False, columns=None, 
                  init_key=None,
                  datatables_options={}, **settings):
        Plugin.__init__(self, **settings)
        self.query          = query
	self.query.uuid	    = query.query_uuid if query else None
        self.query_all      = query_all
        self.query_all_uuid = query_all.query_uuid if query_all else None


    def template_file (self):
        return "univbrisvtamform.html"

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                           "js/dataTables.js", "js/dataTables.bootstrap.js", "js/with-datatables.js",
                           "js/manifold.js", "js/manifold-query.js", 
                           "js/unfold-helper.js",
                           "js/univbrisvtamform.js",
                           ] ,
            'css_files': [ "css/dataTables.bootstrap.css",
                           "css/dataTables.full_numbers.css",
                           "css/univbrisvtamform.css",
                           ],
            }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 
                'query_uuid', 'query_all_uuid', 
                'checkboxes', 'datatables_options', 
                'hidden_columns', 'init_key',]
