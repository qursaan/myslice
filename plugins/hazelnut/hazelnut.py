from unfold.plugin import Plugin

class Hazelnut (Plugin):

    # set checkboxes if a final column with checkboxes is desired
    # pass columns as the initial set of columns
    #   if None then this is taken from the query's fields
    def __init__ (self, query, checkboxes=False, columns=None, datatables_options={}, **settings):
        Plugin.__init__ (self, **settings)
        self.query=query
        self.checkboxes=checkboxes
        if columns is not None:
            self.columns=columns
        else:
            self.columns=self.query.fields
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
    def json_settings_list (self): return ['plugin_uuid','query_uuid','checkboxes','datatables_options']
