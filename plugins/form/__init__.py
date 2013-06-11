from unfold.composite import Composite
from unfold.plugin    import Plugin

class CreateForm (Plugin):

    def __init__ (self, **settings):
        Plugin.__init__(self, **settings)
        print "SETTINGS", settings
        assert 'page'   in settings, "You should specify page"
        assert 'object' in settings or 'fields' in settings, "You should specify object or field list"

        if 'object' in settings:
            # Retrieve object fields from metadata
            metadata = settings['page'].get_metadata()
            md_o = metadata.details_by_object(settings['object'])
            self.columns = md_o['column']

        elif 'fields' in settings:
            self.columns = []
            for field in settings['fields']:
                c = {
                    'name'          : field.get('name', ''),
                    'field'         : field.get('field', ''),
                    'type'          : field.get('type', 'input'),
                    'description'   : field.get('description', ''),
                    'validate_rx'   : field.get('validate_rx', ''),
                    'validate_err'  : field.get('validate_err', ''),
                    'old_value'     : 'POST',
                }
                self.columns.append(c)
    
    def requirements (self):
        return { 'js_files'     : ['js/form.js', 'js/jquery.validate.js', ],
                 'css_files'    : ['css/form.css'] 
                 }
    def export_json_settings(self):
        # We need initialization, even though we are not associated with a query
        return True

    def template_env (self, request):
        env={}
        env.update(self.__dict__)
        #env['columns']=self.columns
        return env

    def template_file (self):
        return "form.html"

    def json_settings_list (self): return ['plugin_uuid', 'columns']

    def get_validation_js(self):
        # XXX We need to avoid sending the same query twice !"
        # somehow store something into the dom, to perform an update afterwards
        # XXX This should be moved to a template
        # XXX We also need some storage into the wizard to be displayed later
        return """
            // Useless since this is now a parameter
            //frm = document.forms['form_%(domid)s'];

            // Loop on the fields and test regexp if present
            err = false;
            $.each(options.columns, function(column) {
                if (!frm.elements[column['field']].match(column['validate_rx'])) {
                    $('err_%(domid)s_' + column['field']).html(column['validation_err']);
                    err = true;
                }
            });
            if (!err) {
                // Issue json query
            }
        """ % self.__dict__
