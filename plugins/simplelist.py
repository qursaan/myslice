from django.template.loader import render_to_string

from engine.plugin import Plugin

class SimpleList (Plugin) :

    # SimpleList is useless per se anyways
    def title (self) : return "Title for Simple List"

    def template (self): return "simplelist.html"

    def requirements (self):
        return { 'js_files' : [ "js/simplelist.js" ],
                 'css_files': [ "css/simplelist.css" ],
# for tests
#                 'js_chunks' : "/* a javascript chunk */",       
#                 'css_chunks': "/* a css style */ ",
                 }
