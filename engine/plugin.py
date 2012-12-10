# this is the abstract interface for Plugin instances
# so it should be specialized in real plugin classes
# like e.g. plugins.simplelist.SimpleList

from django.template.loader import render_to_string

class Plugin:

    uid=0

    def __init__ (self, **settings):
        self.uuid=Plugin.uid
        Plugin.uid += 1
        # we store as a dictionary the arguments passed to constructor
        # e.g. SimpleList (visible=True) => _settings = {'visible':True}
        self._settings=settings

    def get_class (self): return type(self).__name__

    # shorthands to inspect _settings
    def get_setting (self, setting, default):
        if setting not in self._settings: return default
        else:                             return self._settings[setting]

    def is_visible (self): return self.get_setting ('visible',True)
    def is_hidable (self): return self.get_setting ('hidable',False)
    def is_hidden_by_default (self): return self.get_setting ('hidden_by_default', False)

    # returns the html code for that plugin
    # in essence, wraps the results of self.render_content ()
    def render (self):
        uuid = self.uuid
        title = self.get_class()
        plugin_content = self.render_content ()

        # xxx missing from the php version
        # compute an 'optionstr' from the set of available settings/options as a json string
        # that gets passed to jquery somehow
        # see the bottom of 
        result = render_to_string ('plugin-wrap.html',
                                   {'uuid':uuid, 'title':title,
                                    'visible':self.is_visible(),
                                    'hidable':self.is_hidable(),
                                    'hidden':self.is_hidden_by_default(),
                                    'plugin_content' : plugin_content,
                                    'optionstr' : 'xxx-todo',
                                    })

        return result
        
