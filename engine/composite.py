from engine.plugin import Plugin

class Composite (Plugin):

    def __init__ (self, sons=[], *args, **kwds):
        self.sons=sons
        Plugin.__init__ (self, *args, **kwds)
        
    def insert (self, plugin):
        self.sons.append(plugin)

