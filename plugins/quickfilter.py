from engine.plugin import Plugin

class QuickFilter (Plugin) :

    def __init__ (self, list=[], with_datatables=False, **settings):
        Plugin.__init__ (self, **settings)
        self.list=list
        self.add_to_settings ('list')
        self.with_datatables = with_datatables
        self.add_to_settings ('with_datatables')
        

    def title (self) : return "Title for Quick "

    def template_file (self): return "quickfilter.html"

    def requirements (self):
        reqs = { 'js_files' : [ "js/quickfilter.js" ],
                 'css_files': [ "css/quickfilter.css" ],
                 }
        return reqs

    def exclude_from_json (self):
        return ['list']
  