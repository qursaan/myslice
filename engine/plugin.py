# this is the abstract interface for Plugin instances
# so it should be specialized in real plugin classes
# like e.g. plugins.simplelist.SimpleList

import json

from django.template.loader import render_to_string

class Plugin:

    uid=0

    def __init__ (self, visible=True, hidable=True, hidden_by_default=False, **settings):
        # xxx should generate some random id
        self.uuid=Plugin.uid
        Plugin.uid += 1
        self.visible=visible
        self.hidable=hidable
        self.hidden_by_default=hidden_by_default
        # we store as a dictionary the arguments passed to constructor
        # e.g. SimpleList (list=[1,2,3]) => _settings = { 'list':[1,2,3] }
        # our own settings are not made part of _settings but could be..
        self._settings=settings
#        print "Created plugin with settings %s"%self._settings.keys()

    def classname (self): 
        try:    return self.__class__.__name__
        except: return 'Plugin'

    # shorthands to inspect _settings
    def get_setting (self, setting, default):
        if setting not in self._settings: return default
        else:                             return self._settings[setting]

    def is_visible (self): return self.visible
    def is_hidable (self): return self.hidable
    def is_hidden_by_default (self): return self.hidden_by_default

    # returns the html code for that plugin
    # in essence, wraps the results of self.render_content ()
    def render (self, request):
        uuid = self.uuid
        classname = self.classname()
        plugin_content = self.render_content (request)

        # expose _settings in json format to js
        settings_json = json.dumps(self._settings, separators=(',',':'))

        # xxx missing from the php version
        # compute an 'optionstr' from the set of available settings/options as a json string
        # that gets passed to jquery somehow
        # see the bottom of 
        result = render_to_string ('widget-plugin.html',
                                   {'uuid':uuid, 'classname':classname,
                                    'visible':self.is_visible(),
                                    'hidable':self.is_hidable(),
                                    'hidden':self.is_hidden_by_default(),
                                    'plugin_content' : plugin_content,
                                    'settings_json' : settings_json,
                                    })

        return result
        
    # you may redefine this completely, but if you don't we'll just use method 
    # template() to find out which template to use, and env() to find out which 
    # dictionary to pass the templating system
    def render_content (self, request):
        """Should return an HTML fragment"""
        template = self.template()
        env=self.render_env(request)
        if not isinstance (env,dict):
            raise Exception, "%s.render_env returns wrong type"%self.classname()
        env.update(self._settings)
        result=render_to_string (template, env)
        print "%s.render_content: BEG --------------------"%self.classname()
        print "env=%s"%env.keys()
        print result
        print "%s.render_content: END --------------------"%self.classname()
        return result

    def render_env (self, request): return {}
    ######################################## abstract interface

    # your plugin is expected to implement either 
    # (*) def render_content(self, request) -> html fragment
    # -- or --
    # (*) def template(self) -> filename
    # (*) def render_env (self, request) -> dict
    #   this is the variable->value association used to render the template
    # in which case the html template will be used

    def title (self): return "you should redefine title()"

    # tell the framework about requirements in the document header
    def media_js (self): pass
