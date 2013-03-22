from types import StringTypes, ListType

from django.template.loader import render_to_string

debug=True

class Prelude:

    """A class for collecting dependencies on js/css files or fragments"""

    keys=[ 'js_files','css_files','js_chunks', 'css_chunks' ]
    def __init__ (self, js_files=None, css_files=None, js_chunks=None, css_chunks=None):
        # it's tempting to use sets but sets are not ordered..
        self.js_files  = Prelude._normalize(js_files)
        self.css_files = Prelude._normalize(css_files)
        self.js_chunks = Prelude._normalize(js_chunks)
        self.css_chunks= Prelude._normalize(css_chunks)

    @staticmethod
    def _normalize (input):
        if not input:                           return []
        elif isinstance (input, ListType):      return input
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

    def inspect_string (self,msg):
        result =  'Prelude.inspect %s (%s) with '%(msg,self)
        result += ",".join( [ "%s->%s"%(k,len(getattr(self,k))) for k in ['js_files','js_chunks','css_files','css_chunks'] ] )
        return result
    def inspect (self,msg):
        print self.inspect_string(msg)

    # first attempt was to use a simple dict like this
    #    env={}
    #    env['js_files']=  self.js_files
    #    env['css_files']= self.css_files
    #    env['js_chunks']= '\n'.join(self.js_chunks)
    #    env['css_chunks']='\n'.join(self.css_chunks)
    #    return env
    # together with this in layout-unfold2.html
    # {% for js_file in js_files %} {% insert_str prelude js_file %} {% endfor %}
    # {% for css_file in css_files %} {% insert_str prelude css_file %} {% endfor %}
    # somehow however this would not work too well, 
    # probably insert_above is not powerful enough to handle that
    # 
    # so a much simpler and safer approach is for use to compute the html header directly
    def prelude_env (self): 
        env={}
        env['js_files']=  self.js_files
        env['css_files']= self.css_files
        env['js_chunks']= self.js_chunks
        env['css_chunks']=self.css_chunks
        if debug:
            print "prelude has %d js_files, %d css files, %d js chunks and %d css_chunks"%\
                (len(self.js_files),len(self.css_files),len(self.js_chunks),len(self.css_chunks),)
        # not sure how this should be done more cleanly
        from myslice.settings import STATIC_URL
        env ['STATIC_URL'] = STATIC_URL
        # render this with prelude.html and put the result in header_prelude
        header_prelude = render_to_string ('prelude.html',env)
        return { 'header_prelude' : header_prelude }
