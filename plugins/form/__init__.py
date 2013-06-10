from unfold.composite import Composite
from unfold.plugin    import Plugin

class CreateForm (Plugin):

    def __init__ (self, **settings):
        Plugin.__init__(self, **settings)
        print "SETTINGS", settings
        assert 'page'   in settings, "You should specify page"
        assert 'object' in settings, "You should specify object"

        # Retrieve object fields from metadata
        metadata = settings['page'].get_metadata()
        md_o = metadata.details_by_object(settings['object'])
        self.columns = md_o['column']
    
    def requirements (self):
        return { 'js_files'     : ['js/form.js', 'js/jquery.validate.js', ],
                 'css_files'    : ['css/form.css'] 
                 }

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        #env['columns']=self.columns
        return env

    def template_file (self):
        return "form.html"

    def json_settings_list (self): return ['plugin_uuid']

    def get_validation_js(self):
        # XXX We need to avoid sending the same query twice !"
        # somehow store something into the dom, to perform an update afterwards
        # XXX This should be moved to a template
        # XXX We also need some storage into the wizard to be displayed later
        return "alert('validation'); return true;"
