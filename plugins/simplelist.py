from engine.plugin import Plugin

class SimpleList (Plugin) :

    # it would make sense to *not* define any constructor here and let Plugin kick in
    # however it feels nicer this way as we document the settings used in our own template
    # plus it's less confusing for any subclass if they can be sure which constructor to call
    def __init__ (self, list=[], with_datatables=False, **settings):
        Plugin.__init__ (self, **settings)
        self.list=list
# don't expose this as it's big and 
        self.add_to_settings ('list')
        self.with_datatables = with_datatables
        self.add_to_settings ('with_datatables')

    # SimpleList is useless per se anyways
    def template_file (self): return "simplelist.html"

    def requirements (self):
        reqs = { 'js_files' : [ "js/simplelist.js" ],
                 'css_files': [ "css/simplelist.css" ],
                 }
        if self.with_datatables:
            reqs['js_files'].append ("datatables/js/dataTables.js")
            reqs['js_files'].append ("js/with-datatables.js")
        return reqs
# for tests
#                 'js_chunks' : "/* a javascript chunk */",       
#                 'css_chunks': "/* a css style */ ",

    def exclude_from_json (self):
        return ['list']
