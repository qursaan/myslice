from engine.composite import Composite

class Tabs (Composite):
    
    def requirements (self):
        return { 'js_files'     : 'bootstrap/js/bootstrap.js',
                 'css_files'    : ['bootstrap/css/bootstrap.css',
                                   'css/tabs.css',
                                   ] }

    def template_file (self):
        return "tabs.html"

