from engine.composite import Composite

class Tabs (Composite):
    
    def title (self): 
        return "Some tabs"

    def requirements (self):
        return { 'js_files'     : 'bootstrap/js/bootstrap.js',
                 'css_files'    : ['bootstrap/css/bootstrap.css',
                                   'css/tabs.css',
                                   ] }

    def template (self):
        return "tabs.html"

