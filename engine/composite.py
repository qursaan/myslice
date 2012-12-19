from engine.plugin import Plugin
from engine.requirements import Requirements

class Composite (Plugin):

    def __init__ (self, sons=[], *args, **kwds):
        self.sons=sons
        Plugin.__init__ (self, *args, **kwds)
        
    def insert (self, plugin):
        self.sons.append(plugin)

