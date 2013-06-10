from unfold.composite import Composite
from unfold.plugin    import Plugin

class Wizard(Composite):
   
    def __init__(self, *args, **kwargs):
        Composite.__init__(self, *args, **kwargs)
        self.validate_step_js = []
        
        # This, as well as the setting passing code, requires all step to be passed at init :/
        for i, son in enumerate(self.sons):
            try:
                js = son.get_validation_js() 
                js_name = "%s_validate_step_%d" % (self.domid.replace('-', '_'), i)
                self.add_js_chunks("""
                %s = function() {
                    %s
                }
                """ % (js_name, js))
            except Exception, e:
                js_name = 'null'
            self.validate_step_js.append(js_name)

#            self.add_js_chunks("""
#            %s = function() {
#                %s
#            }
#            """ % (js_name, js))

    def export_json_settings(self):
        # We need initialization, even though we are not associated with a query
        return True
    
    def requirements (self):
        #return { 'js_files'     : ['js/wizard.js', 'js/jquery.smartWizard-2.0.min.js', ],
        return { 'js_files'     : ['js/wizard.js', 'js/jquery.smartWizard-2.0.js', ],
                 'css_files'    : ['css/wizard.css', 'css/smart_wizard.css', ] 
                 }

    def template_file (self):
        return "wizard.html"

    # the list of things passed to the js plugin
    def json_settings_list (self): return ['plugin_uuid', 'start_step', 'validate_step_js']
