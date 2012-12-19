from plugins.simplelist import SimpleList

class SliceList (SimpleList):
    
    def __init__ (self, list=[], **settings):
        SimpleList.__init__(self, **settings)
        self.list = [ "<a href='/slice/%s/' class='slicelist'>%s</a>"%(x,x) for x in list ]
        self.add_to_settings ('list')

    def title (self):
        return "Slice list"

#    def requirements (self):
#        reqs=SimpleList.requirements(self)
#        reqs['js_files'].append('slice.js')
#        reqs['js_files'].append('slice2.js')
#        reqs['css_files'].append('slice.css')
#        reqs['css_files'].append('slice2.css')
#        reqs['js_chunks']=['js chunk1','js chunk2']
#        reqs['css_chunks']=['css chunk1','css chunk2']
#        return reqs
