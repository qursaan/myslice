# this is the abstract interface for Plugin instances
# so it should be specialized in real plugin classes
# like e.g. plugins.simplelist.SimpleList

import json

from django.template.loader import render_to_string

from engine.page import Page
from engine.prelude import Prelude

#################### 
# set DEBUG to
# . False : silent
# . [ 'SliceList', 'TabbedView' ] : to debug these classes
# . True : to debug all plugin

DEBUG= False
#DEBUG= [ 'SliceList' ]

# decorator to deflect calls on Plugin to its Prelude through self.page.prelude
def to_prelude (method):
    def actual (self, *args, **kwds):
        prelude_method=Prelude.__dict__[method.__name__]
        return prelude_method(self.page.prelude,*args, **kwds)
    return actual

class Plugin:

    # using a simple incremental scheme to generate domids for now
    # we just need this to be unique in a page
    domid=0

    @staticmethod
    def newdomid():
        Plugin.domid += 1
        return "plugin-%d"%Plugin.domid

    ########## 
    # Constructor
    #### mandatory
    # . page: the context of the request being served
    # . title: is used visually for displaying the widget
    #### optional
    # . togglable: whether it can be turned on and off (like PleKitToggle)
    # . toggled: if togglable, what's the initial status
    # . visible: if not set the plugin does not show up at all
    #            (not quite sure what this was for)
    #### internal data
    # . domid: created internally, but can be set at creation time if needed
    #          useful for hand-made css, or for selecting an active plugin in a composite
    # . rank: this is for plugins sons of a composite plugin
    #### custom
    # any other setting can also be set when creating the object, like
    # p=Plugin(foo='bar')
    # which will result in 'foo' being accessible to the template engine
    # 
    def __init__ (self, page, title, domid=None,
                  visible=True, togglable=True, toggled=True, **settings):
        self.page = page
        self.title=title
        # callers can provide their domid for css'ing 
        if not domid: domid=Plugin.newdomid()
        self.domid=domid
        self.classname=self._py_classname()
        self.plugin_classname=self._js_classname()
        self.visible=visible
        self.togglable=togglable
        self.toggled=toggled
        # what comes from subclasses
        for (k,v) in settings.iteritems():
            setattr(self,k,v)
            if self.need_debug(): print "%s init - subclass setting %s"%(self.classname,k)
        # minimal debugging
        if self.need_debug():
            print "%s init dbg .... BEG"%self.classname
            for (k,v) in self.__dict__.items(): print "dbg %s:%s"%(k,v)
            print "%s init dbg .... END"%self.classname
        # do this only once the structure is fine
        self.page.record_plugin(self)

    def _py_classname (self): 
        try:    return self.__class__.__name__
        except: return 'Plugin'

    def _js_classname (self): 
        try:    return self.plugin_classname ()
        except: return self._py_classname()

    ##########
    def need_debug (self):
        if not DEBUG:           return False
        if DEBUG is True:       return True
        else:                   return self.classname in DEBUG

    def setting_json (self, setting):
        # TMP: js world expects plugin_uuid
        if setting=='plugin_uuid':
            value=self.domid
        elif setting=='query_uuid':
            try: value=self.query.uuid
            except: return '%s:"undefined"'%setting
        else:
            value=getattr(self,setting,None)
            if not value: value = "unknown-setting-%s"%setting
        # first try to use to_json method (json.dumps not working on class instances)
        try:    value_json=value.to_json()
        except: value_json=json.dumps(value,separators=(',',':'))
        return "%s:%s"%(setting,value_json)

    # expose in json format to js the list of fields as described in json_settings_list()
    # and add plugin_uuid: domid in the mix
    # NOTE this plugin_uuid thing might occur in js files from joomla/js, ** do not rename **
    def settings_json (self):
        result = "{"
        result += ",".join([ self.setting_json(setting) for setting in self.json_settings_list() ])
        result += "}"
        return result

    # as a first approximation, only plugins that are associated with a query
    # need to be prepared for js - others just get displayed and that's it
    def is_asynchroneous (self):
        return 'query' in self.__dict__
    
    # returns the html code for that plugin
    # in essence, wraps the results of self.render_content ()
    def render (self, request):
        # call render_content
        plugin_content = self.render_content (request)
        # shove this into plugin.html
        env = {}
        env ['plugin_content']= plugin_content
        env.update(self.__dict__)
        result = render_to_string ('plugin.html',env)

        # export this only for relevant plugins
        if self.is_asynchroneous():
            env ['settings_json' ] = self.settings_json()
            # compute plugin-specific initialization
            js_init = render_to_string ( 'plugin-setenv.js', env )
            self.add_js_chunks (js_init)
        
        # interpret the result of requirements ()
        self.handle_requirements (request)

        return result
        
    # you may redefine this completely, but if you don't we'll just use methods 
    # . template_file() to find out which template to use, and 
    # . template_env() to compute a dictionary to pass along to the templating system
    def render_content (self, request):
        """Should return an HTML fragment"""
        template = self.template_file()
        env=self.template_env(request)
        if not isinstance (env,dict):
            raise Exception, "%s.template_env returns wrong type"%self.classname
        result=render_to_string (template, env)
        if self.need_debug():
            print "%s.render_content: BEG --------------------"%self.classname
            print "template=%s"%template
            print "env.keys=%s"%env.keys()
            #print "env=%s"%env
            #print result
            print "%s.render_content: END --------------------"%self.classname
        return result

    # or from the result of self.requirements()
    def handle_requirements (self, request):
        try:
            d=self.requirements()
            for (k,v) in d.iteritems():
                if self.need_debug():
                    print "%s: handling requirement %s"%(self.classname,v)
                method_name='add_'+k
                method=Page.__dict__[method_name]
                method(self.page,v)
        except AttributeError: 
            # most likely the object does not have that method defined, which is fine
            pass
        except:
            import traceback
            traceback.print_exc()
            pass

    #################### requirements/prelude management
    # just forward to our prelude instance - see decorator above
    @to_prelude
    def add_js_files (self):pass
    @to_prelude
    def add_css_files (self):pass
    @to_prelude
    def add_js_chunks (self):pass
    @to_prelude
    def add_css_chunks (self):pass

    ######################################## abstract interface
    # your plugin is expected to implement either 
    # (*) def render_content(self, request) -> html fragment
    # -- or --
    # (*) def template_file (self) -> filename
    #   relative to STATIC 
    # (*) def template_env (self, request) -> dict
    #   this is the variable->value association used to render the template
    # in which case the html template will be used

    # if you see this string somewhere your template_file() code is not kicking in
    def template_file (self):           return "undefined_template"
    def template_env (self, request):   return {}

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
    
#    # for better performance
#    # you can specify a list of keys that won't be exposed as json attributes
#    def exclude_from_json (self): return []

    # mandatory : define the fields that need to be exposed to json as part of 
    # plugin initialization
    # mention 'domid' if you need plugin_uuid
    # also 'query_uuid' gets replaced with query.uuid
    def json_settings_list (self): return ['json_settings_list-must-be-redefined']

    # might also define this one; see e.g. slicelist.py that piggybacks simplelist js code
    # def plugin_classname (self):
