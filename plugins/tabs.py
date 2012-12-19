from engine.composite import Composite

class Tabs (Composite):
    
    def title (self): 
        return "Some tabs"

    def requirements (self):
        return { 'js_files'     : 'bootstrap/js/bootstrap.js',
                 'css_files'    : 'bootstrap/css/bootstrap.css' }

    def template (self):
        return "tabs.html"
    
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
    
