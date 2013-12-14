from unfold.plugin import Plugin

class ValidateButton (Plugin):

    """This plugin is designed to work together with topmenu.
    
It will check to see if user has PI rights at least on one authority, 
and if so will enable corresponding button in topmenu.

A realistic example would have incoming query as

Query.get('ple:user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')

"""

    def __init__ (self, query=None, button_domid=None, **settings):
        Plugin.__init__ (self, **settings)
        # set defaults
        if query is None: 
            query = Query.get('ple:user').filter_by('user_hrn', '==', '$user_hrn').select('pi_authorities')
        if button_domid is None: button_domid="topmenu-validate"
        self.query=query
        self.button_domid=button_domid

    # this does not have any materialization
    def render_content (self, request):
        return ""
    
    def requirements (self):
        return { 'js_files': [ 'js/validatebutton.js', 'js/manifold-query.js', 
                               "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                               ], }

    def json_settings_list (self):
        return [ 'query_uuid', 'button_domid', ]
