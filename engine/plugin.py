# this is the abstract interface for Plugin instances
# so it should be specialized in real plugin classes
# like e.g. plugins.simplelist.SimpleList

import json

from django.template.loader import render_to_string

from engine.prelude import Prelude

# set to
# . False : silent
# [ 'SliceList', 'TabbedView' ] : to debug these classes
# True : to debug all slices

DEBUG= [ 'SliceList' ]

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
        if self.need_debug():
            print "Plugin.__init__ Created plugin with settings %s"%self._settings.keys()

    # subclasses might handle some fields in their own way, 
    # in which case this call is needed to capture that setting
    # see e.g. SimpleList or SliceList for an example of that
    def add_to_settings (self, setting_name):
        self._settings[setting_name]=getattr(self,setting_name)

    def classname (self): 
        try:    return self.__class__.__name__
        except: return 'Plugin'

    # shorthands to inspect _settings
    def get_setting (self, setting, default=None):
        if setting not in self._settings: return default
        else:                             return self._settings[setting]

    def is_visible (self): return self.visible
    def is_hidable (self): return self.hidable
    def is_hidden_by_default (self): return self.hidden_by_default

    ##########
    def need_debug (self):
        if not DEBUG:           return False
        if DEBUG is True:       return True
        else:                   return self.classname() in DEBUG

    # returns the html code for that plugin
    # in essence, wraps the results of self.render_content ()
    def render (self, request):
        uuid = self.uuid
        classname = self.classname()
        # initialize prelude placeholder 
        self._init_request (request)
        
        # call render_content
        plugin_content = self.render_content (request)
        # expose _settings in json format to js
        settings_json = json.dumps (self._settings, separators=(',',':'))

        result = render_to_string ('widget-plugin.html',
                                   {'uuid':uuid, 
                                    'classname':classname,
                                    'visible':self.is_visible(),
                                    'hidable':self.is_hidable(),
                                    'hidden':self.is_hidden_by_default(),
                                    'plugin_content' : plugin_content,
                                    'settings_json' : settings_json,
                                    })

        # handle requirements() if defined on this class
        try: 
            self.handle_requirements (request, self.requirements())
        except AttributeError: 
            # most likely the object does not have that method defined, which is fine
            pass
        except:
            import traceback
            traceback.print_exc()
            pass

        return result
        
    # you may redefine this completely, but if you don't we'll just use methods 
    # . template() to find out which template to use, and 
    # . render_env() to compute a dictionary to pass along to the templating system
    def render_content (self, request):
        """Should return an HTML fragment"""
        template = self.template()
        env=self.render_env(request)
        if not isinstance (env,dict):
            raise Exception, "%s.render_env returns wrong type"%self.classname()
        # expose this class's settings to the template
        # xxx we might need to check that this does not overwrite env..
        env.update(self._settings)
        result=render_to_string (template, env)
        if self.need_debug():
            print "%s.render_content: BEG --------------------"%self.classname()
            print "template=%s"%template
            print "env=%s"%env.keys()
            # print result
            print "%s.render_content: END --------------------"%self.classname()
        return result

    #################### requirements/prelude management
    def _init_request (self, request):
        if not hasattr (request, 'plugin_prelude'): 
            request.plugin_prelude=Prelude()

    def inspect_request (self, request, message):
        has=hasattr(request,'plugin_prelude')
        get=getattr(request,'plugin_prelude','none-defined')
        print "INSPECT (%s), hasattr %s, getattr %s"%(message,has,get)

    # can be used directly in render_content()
    def add_js_files (self, request, files):
        self._init_request (request)
        request.plugin_prelude.add_js_files (files)
    def add_css_files (self, request, files):
        self._init_request (request)
        request.plugin_prelude.add_css_files (files)
    def add_js_chunks (self, request, chunks):
        self._init_request (request)
        request.plugin_prelude.add_js_chunks (chunks)
    def add_css_chunks (self, request, chunks):
        self._init_request (request)
        request.plugin_prelude.add_css_chunks (chunks)

    # or from the result of self.requirements()
    def handle_requirements (self, request, d):
        for (k,v) in d.iteritems():
            if self.need_debug():
                print "%s: handling requirement %s"%(self.classname(),v)
            method_name='add_'+k
            method=Plugin.__dict__[method_name]
            method(self,request,v)

    ######################################## abstract interface
    def title (self): return "you should redefine title()"

    # your plugin is expected to implement either 
    # (*) def render_content(self, request) -> html fragment
    # -- or --
    # (*) def template(self) -> filename
    #   relative to STATIC 
    # (*) def render_env (self, request) -> dict
    #   this is the variable->value association used to render the template
    # in which case the html template will be used

    # if you see this string somewhere your template() code is not kicking in
    def template (self):                return "undefined_template"
    def render_env (self, request):     return {}

#    # tell the framework about requirements (for the document <header>)
#    # the notion of 'Media' in django provides for medium-dependant
#    # selection of css files
#    # as a first attempt however we keep a flat model for now
#    # can use one string instead of a list or tuple if needed, 
#    # see requirements.py for details
#    def requirements (self): 
#        return { 'js_files' : [],       # a list of relative paths for js input files
#                 'css_files': [],       # ditto for css, could have been a dict keyed on
#                                        # media instead
#                 'js_chunk' : [],       # (lines of) verbatim javascript code 
#                 'css_chunk': [],       # likewise for css scripts
#                 }
    
