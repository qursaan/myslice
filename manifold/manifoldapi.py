# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

debug=True

class SessionExpired (Exception):
    def __init__ (self,message):
        self.message=message
    def __repr__ (self): 
        return "<SessionExpired: %s>"%self.message

class ManifoldAPI:

    def __init__(self, auth=None, cainfo=None):
        
        config = Config()
        self.auth = auth
        self.cainfo = cainfo
        self.errors = []
        self.trace = []
        self.calls = {}
        self.multicall = False
        self.url = config.manifold_url
        self.server = xmlrpclib.Server(self.url, verbose=False, allow_none=True)

    def __getattr__(self, methodName):
        def func(*args, **kwds):
            try:
                result=getattr(self.server, methodName)(self.auth, *args, **kwds)
                if debug:
                    print '===> backend call',methodName, self.auth, self.url,'->',
                    if not result:                        print "no/empty result"
                    elif isinstance (result,str):         print "result is '%s'"%result
                    elif isinstance (result,list):        print "result is a %d-elts list"%len(result)
                    else:                                 print "dont know how to display result"
                return result
            except xmlrpclib.Fault, error:
                ### xxx this is very rough for now
                # until we have some agreement about how the API calls should return error conditions
                # in some less unpolite way than this anoanymous exception, we assume it's a problem with the session
                # that needs to be refreshed
                if error.faultCode == 8002:
                    reason="most likely your session has expired"
                    reason += " (the manifold API has no unambiguous error reporting mechanism yet)"
                    raise SessionExpired(reason)
            except Exception,error:
                print "ManifoldAPI: unexpected exception",error
                raise
        return func

    def send_manifold_query (self, manifold_query):
        (action,subject)= (manifold_query.action,manifold_query.subject)
        if action=='get':
            # use self.Get rather than self.server.Get so we catch exceptions as per __getattr__
            return self.Get(self.auth, subject, manifold_query.filters, {}, manifold_query.fields)
        # xxx...
        else:
            print "WARNING: ManifoldAPI.send_manifold_query: only 'get' implemented for now"
