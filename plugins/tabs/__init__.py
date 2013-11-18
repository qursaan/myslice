from unfold.composite import Composite

class Tabs (Composite):
    
    def requirements (self):
        return { 'js_files'     : ['js/tabs.js', 'js/bootstrap.js'],
                 'css_files'    : ['css/bootstrap.css', 'css/tabs.css', ] 
                 }

    def template_file (self):
        return "tabs.html"

    # see Composite.py for the details of template_env, that exposes global
    # 'sons' as a list of sons with each a set of a few attributes
    def json_settings_list (self):
        return []

