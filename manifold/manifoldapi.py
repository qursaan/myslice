# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

from manifoldresult import ManifoldResult, ManifoldCode

debug=False
debug=True

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

    def __repr__ (self): return "ManifoldAPI[%s]"%self.url

    def __getattr__(self, methodName):
        def func(*args, **kwds):
            if (debug): 
                print "entering ManifoldAPI.%s"%methodName,
                print "args",args,
                print "kwds",kwds
            try:
                result=getattr(self.server, methodName)(self.auth, *args, **kwds)
                if debug:
                    print '===> backend call',methodName, self.auth, self.url,'->',
                    if not result:                        print "[no/empty result]"
                    elif isinstance (result,str):         print "result is '%s'"%result
                    elif isinstance (result,list):        print "result is a %d-elts list"%len(result)
                    else:                                 print "[dont know how to display result]"
                return ManifoldResult (code=ManifoldCode.SUCCESS, value=result)
            except xmlrpclib.Fault, error:
                ### xxx this is very rough for now
                # until we have some agreement about how the API calls should return error conditions
                # in some less unpolite way than this anoanymous exception, we assume it's a problem with the session
                # that needs to be refreshed
                if debug: print "Session Expired"
                if error.faultCode == 8002:
                    reason="most likely your session has expired"
                    reason += " (the manifold API has no unambiguous error reporting mechanism yet)"
                    return ManifoldResult (code=ManifoldCode.SESSION_EXPIRED, output=reason)
            except Exception,error:
                print "ManifoldAPI: unexpected exception",error
                return ManifoldResult (code=ManifoldResult.UNKNOWN_ERROR, output="%s"%error)
        return func

    def send_manifold_query (self, manifold_query):
        (action,subject)= (manifold_query.action,manifold_query.subject)
        if action=='get':
            # use self.Get rather than self.server.Get so we catch exceptions as per __getattr__
            return self.Get(subject, manifold_query.filters, {}, manifold_query.fields)
        # xxx...
        else:
            print "WARNING: ManifoldAPI.send_manifold_query: only 'get' implemented for now"
