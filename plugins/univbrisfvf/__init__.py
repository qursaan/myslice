from unfold.plugin import Plugin

class UnivbrisFvf (Plugin):

    """

////////////////////////////////////////

modified querytable for univbris foam
///////////////////////////////////////

A plugin for displaying a query as a list

More accurately, we consider a subject entity (say, a slice) 
that can be linked to any number of related entities (say, resources, or users)
The 'query' argument will correspond to the subject, while
'query_all' will fetch the complete list of 
possible candidates for the relationship.

Current implementation makes the following assumptions
* query will only retrieve for the related items a list of fields
  that corresponds to the initial set of fields displayed in the table
* query_all on the contrary is expected to return the complete set of 
  available attributes that may be of interest, so that using a QueryEditor
  one can easily extend this table without having to query the backend
* checkboxes is a boolean flag, set to true if a rightmost column
  with checkboxes is desired
* optionally pass columns as the initial set of columns
  if None then this is taken from the query's fields
* init_key is the name of a column that should appear in both queries
  and used internally in the plugin for checkboxes initialization. 
  If not specified, metadata will be used to find out a primary key.
  However in the case of nodes & slice for example, the default key
  as returned by the metadata would be 'urn', but 'urn' could only 
  be used for this purpose if it gets displayed initially, which is
  not necessarily a good idea.
  This is why a slice view would use 'hrn' here instead.
* datatables_options are passed to dataTables as-is; 
  however please refrain from passing an 'aoColumns' 
  as we use 'aoColumnDefs' instead.
"""

    def __init__ (self, query=None, query_all=None, 
                  checkboxes=False, columns=None, 
                  init_key=None,
                  datatables_options={}, **settings):
        Plugin.__init__ (self, **settings)
        self.query          = query
        # Until we have a proper way to access queries in Python
        self.query_all      = query_all
        self.query_all_uuid = query_all.query_uuid if query_all else None


    def template_file (self):
        return "univbrisfvf.html"

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        #env['columns']=self.columns
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                           "js/dataTables.js", "js/dataTables.bootstrap.js", "js/with-datatables.js",
                           "js/manifold.js", "js/manifold-query.js", 
                           "js/unfold-helper.js",
                          # querytable.js needs to be loaded after dataTables.js as it extends 
                          # dataTableExt.afnSortData
                           "js/univbrisfvf.js",
                           ] ,
            'css_files': [ "css/dataTables.bootstrap.css",
                           # hopefully temporary, when/if datatables supports sPaginationType=bootstrap3
                           # for now we use full_numbers, with our own ad hoc css 
                           "css/dataTables.full_numbers.css",
                           "css/univbrisfvf.css",
                           ],
            }
        return reqs

    # the list of things passed to the js plugin
    def json_settings_list (self):
        return ['plugin_uuid', 'domid', 
                'query_uuid', 'query_all_uuid', 
                'checkboxes', 'datatables_options', 
                'hidden_columns', 'init_key',]
