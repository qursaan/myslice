from unfold.plugin import Plugin

class Composite (Plugin):

    def __init__ (self, sons=[], active=None, *args, **kwds):
        Plugin.__init__ (self, *args, **kwds)
        self.sons=sons
        self.active=active
        
    def insert (self, plugin):
        self.sons.append(plugin)

    # xxx currently there is no guarantee that exactly one son will be active
    def template_env (self, request):
        # this is designed so as to support a template like
        # {% for son in sons %} {{ son.rendered }} ...
        def is_active (son):
#            print 'comparing >%s< and >%s<'%(son.domid,self.active)
            return son.domid==self.active
        ranks=range(len(self.sons))
        env = { 'sons':
                 [ { 'rendered': son.render(request),
                     'rank': rank,
                     'active': is_active(son),
                     'title': son.title,
                     'domid': son.domid,
                     'classname': son.classname,
                     }
                   for (son,rank) in zip(self.sons,ranks) ]}
        return env

