from engine.plugin import Plugin

class Composite (Plugin):

    def __init__ (self, sons=[], *args, **kwds):
        Plugin.__init__ (self, *args, **kwds)
        self.sons=sons
        
    def insert (self, plugin):
        self.sons.append(plugin)

    def template_env (self, request):
        # this is designed so as to support a template like
        # {% for son in sons %} {{ son.rendered }} ...
        ranks=range(len(self.sons))
        return { 'sons': 
                 [ { 'rendered': son.render(request),
                     'title': son.title,
                     'uuid': son.uuid,
                     'classname': son.classname,
                     'rank': rank}
                   for (son,rank) in zip(self.sons,ranks) ]}

    # xxx need a way to select an active son, like e.g.
    # Composite (active='some string')
    # and we could then try to find that string in either title or uuid or some other place
    # in which case the corresponding 'son' entry in template_env above would son.active=True
