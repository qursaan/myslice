from engine.plugin import Plugin

class Composite (Plugin):

    def __init__ (self, sons=[], *args, **kwds):
        Plugin.__init__ (self, *args, **kwds)
        self.sons=sons
        
    def insert (self, plugin):
        self.sons.append(plugin)

