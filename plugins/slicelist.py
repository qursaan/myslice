from plugins.simplelist import SimpleList

# the SimpleList plugin requires 'key' and 'value' that are used 
# on the results of the query for rendering
class SliceList (SimpleList):
    
    def __init__ (self, **settings):
        SimpleList.__init__(self, key='slice_hrn', value='slice_hrn', **settings)

    # writing a js plugin for that would be overkill, just use SimpleList
    def plugin_classname (self):
        return 'SimpleList'
