from django.template.loader import render_to_string

from engine.plugin import Plugin

class VerticalLayout (Plugin) :
    
    def __init__ (self, sons=[], *args, **kwds):
        self.sons=sons
        Plugin.__init__ (self, *args, **kwds)
        
    def insert (self, plugin):
        self.sons.append(plugin)

    def title (self) : return "VLayout title"

    def render_env (self, request):
        env = {}
        sons_rendered = [ son.render(request) for son in self.sons ]
        sons_titles = [ son.title() for son in self.sons ]
        ids = range (len(self.sons))
        # for now we don't have a title to pass
        sons = [ { 'id':id, 'rendered':rendered, 'title':title } 
                 for id,rendered,title in zip (ids, sons_rendered, sons_titles) ]
        env['sons']=sons
        return env
        

    def template (self):        return "verticallayout.html"

    def media_js ():            return [ 'js/simplelist.js' ]

    def media_css ():           return { 'all': ('css/simplelist.css'), }

