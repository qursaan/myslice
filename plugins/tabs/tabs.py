from engine.composite import Composite

class Tabs (Composite):
    
    def requirements (self):
        return { 'js_files'     : 'js/bootstrap.js',
                 'css_files'    : ['css/bootstrap.css', 'css/tabs.css', ] 
                 }

    def template_file (self):
        return "tabs.html"

