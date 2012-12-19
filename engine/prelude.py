from types import StringTypes, ListType

class Prelude:

    """A class for collecting dependencies on js/css files or fragments"""

    keys=[ 'js_files','css_files','js_chunks', 'css_chunks' ]
    def __init__ (self):
        # it's tempting to use sets but sets are not ordered..
        self.js_files  =[]
        self.css_files =[]
        self.js_chunks =[]
        self.css_chunks=[]

    @staticmethod
    def _normalize (input):
        if   isinstance (input, ListType):      return input
        elif isinstance (input, StringTypes):   return [ input ]
        else:                                   return list (input)

    def add_js_files (self, x):
        for i in Prelude._normalize (x):
            if i not in self.js_files: self.js_files.append(i)
    def add_css_files (self, x):
        for i in Prelude._normalize (x):
            if i not in self.css_files: self.css_files.append(i)
    def add_js_chunks (self, x):
        self.js_chunks += Prelude._normalize (x)
    def add_css_chunks (self, x):
        self.css_chunks += Prelude._normalize (x)

    def render_env (self): 
        env={}
        env['js_files']=  self.js_files
        env['css_files']= self.css_files
        env['js_chunks']= '\n'.join(self.js_chunks)
        env['css_chunks']='\n'.join(self.css_chunks)
        return env
