from unfold.plugin import Plugin

class UnivbrisFv (Plugin):
"""
////////////////////////////////////////
modified querytable for univbris foam
///////////////////////////////////////"""

    def __init__ (self, init_key=None,datatables_options={}, **settings):
	Plugin.__init__ (self, **settings)
	self.columns = list (['switch dpid','port no<->peer dpid/port no.','selected'])
        self.init_key=init_key
        self.datatables_options=datatables_options

    def template_file (self):
        return "univbrisfv.html"

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        env['columns']=self.columns
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                           "js/dataTables.js", "js/dataTables.bootstrap.js", "js/with-datatables.js",
                           "js/manifold.js", "js/manifold-query.js", 
                           "js/unfold-helper.js",
                           "js/univbrisfv.js", 
                           ] ,
            'css_files': [ "css/dataTables.bootstrap.css",
                           "css/dataTables.full_numbers.css",
                           "css/univbrisfv.css" , 
                           ],}
	return reqs

    # the list of things passed to the js plugin
    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 'datatables_options', 'init_key',]
