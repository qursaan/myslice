from unfold.plugin import Plugin

class UnivbrisVtam (Plugin):
    def __init__ (self, query=None, query_all=None, sync_query=None,
                  checkboxes=False, columns=None, 
                  init_key=None,
                  datatables_options={}, **settings):
        Plugin.__init__ (self, **settings)
        self.query          = query
	self.query_uuid	    = query.query_uuid if query else None
        # Until we have a proper way to access queries in Python
        self.query_all      = query_all
        self.query_all_uuid = query_all.query_uuid if query_all else None
	self.sync_query_uuid = sync_query.query_uuid if sync_query else None
        self.checkboxes     = checkboxes
        # XXX We need to have some hidden columns until we properly handle dynamic queries
        if columns is not None:
            self.columns=columns
            self.hidden_columns = []
        elif self.query:
	    self.columns = list (['Testbed', 'Virtualization Server', 'VM name', 'Delete'])
	    #replace production
            #self.columns = self.query.fields
            if query_all:
                #replace production
		self.hidden_columns = []
		# We need a list because sets are not JSON-serializable
                #self.hidden_columns = #list(self.query_all.fields - self.query.fields)
            else:
                self.hidden_columns = []
        else:
            self.columns = []
            self.hidden_columns = []

	self.columns = list (['Testbed', 'Virtualization Server', 'VM name', 'Delete'])
        self.init_key=init_key
        self.datatables_options=datatables_options
        # if checkboxes were required, we tell datatables about this column's type
        # so that sorting can take place on a selected-first basis (or -last of course)
        # this relies on the template exposing the checkboxes 'th' with class 'checkbox'
        if self.checkboxes:
            # we use aoColumnDefs rather than aoColumns -- ignore user-provided aoColumns
            if 'aoColumns' in self.datatables_options:
                print 'WARNING: querytable uses aoColumnDefs, your aoColumns spec. is discarded'
                del self.datatables_options['aoColumns']
            # set aoColumnDefs in datatables_options - might already have stuff in there
            aoColumnDefs = self.datatables_options.setdefault ('aoColumnDefs',[])
            # here 'checkbox' is the class that we give to the <th> dom elem
            # dom-checkbox is a sorting type that we define in querytable.js
            aoColumnDefs.append ( {'aTargets': ['checkbox'], 'sSortDataType': 'dom-checkbox' } )

    def template_file (self):
        return "univbrisvtamplugin.html"

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        env['columns']=self.columns
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js",
 "js/dataTables.js",  "js/dataTables.bootstrap.js", "js/with-datatables.js", "js/jquery.jeditable.js", 
                           "js/manifold.js", "js/manifold-query.js", 
                           "js/unfold-helper.js",
                           "js/univbrisvtam.js",
                           ] ,
            'css_files': [ "css/dataTables.bootstrap.css",
                           "css/dataTables.full_numbers.css",
                           "css/univbrisvtam.css", 
                           ],
            }
        return reqs

    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 
                'query_uuid', 'query_all_uuid', 'sync_query_uuid',
                'checkboxes', 'datatables_options', 
                'hidden_columns', 'init_key',]
