from unfold.plugin import Plugin

class Hazelnut (Plugin):

    # set checkboxes if a final column with checkboxes is desired
    # pass columns as the initial set of columns
    #   if None then this is taken from the query's fields
    def __init__ (self, query=None, query_all=None, checkboxes=False, columns=None, datatables_options={}, **settings):
        Plugin.__init__ (self, **settings)
        self.query          = query
        # Until we have a proper way to access queries in Python
        self.query_all      = query_all
        self.query_all_uuid = query_all.query_uuid if query_all else None
        self.checkboxes=checkboxes
        # XXX We need to have some hidden columns until we properly handle dynamic queries
        if columns is not None:
            self.columns=columns
            self.hidden_columns = []
        elif self.query:
            self.columns = self.query.fields
            if query_all:
                # We need a list because sets are not JSON-serilizable
                self.hidden_columns = list(self.query_all.fields - self.query.fields)
            else:
                self.hidden_columns = []
        else:
            self.columns = []
            self.hidden_columns = []
        self.datatables_options=datatables_options

    def template_file (self):
        return "hazelnut.html"

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        env['columns']=self.columns
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/hazelnut.js", 
                           "js/manifold.js", "js/manifold-query.js", 
                           "js/dataTables.js", "js/dataTables.bootstrap.js", "js/with-datatables.js",
                           "js/spin.presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                           "js/unfold-helper.js",
                           ] ,
            'css_files': [ "css/hazelnut.css" , 
                           "css/dataTables.bootstrap.css",
                           ],
            }
        return reqs

    # the list of things passed to the js plugin
    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 'query_uuid', 'query_all_uuid', 'checkboxes', 'datatables_options', 'hidden_columns']
