from engine.plugin import Plugin

class QuickFilter (Plugin) :

    def __init__ (self, list=[], with_datatables=False, **settings):
        Plugin.__init__ (self, **settings)
        self.list=[{'key': 'Slice', 'values': ['slice1','slice2']}, \
                          {'key': 'Type', 'values': ['type1','type2']}, \
                          {'key': 'Network', 'values': ['net1','net2']}]
        self.add_to_settings ('list')
        self.with_datatables = with_datatables
        self.add_to_settings ('with_datatables')
        self.criterias = [{'key': 'Slice', 'values': ['slice1','slice2']}, \
                          {'key': 'Type', 'values': ['type1','type2']}, \
                          {'key': 'Network', 'values': ['net1','net2']}]

    def title (self) : return "Title for Quick "

    def template_file (self): return "quickfilter.html"

    def requirements (self):
        reqs = { 'js_files' : [ "js/quickfilter.js" ],
                 'css_files': [ "css/quickfilter.css" ],
                 }
        if self.with_datatables:
            reqs['js_files'].append ("datatables/js/dataTables.js")
            reqs['js_files'].append ("js/with-datatables.js")
        print self.classname(),reqs
        return reqs

