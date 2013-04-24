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

    # xxx temporary code for scaffolding a ManifolResult on top of an API that does not expose error info
    # as of march 2013 we work with an API that essentially either returns the value, or raises 
    # an xmlrpclib.Fault exception with always the same 8002 code
    # since most of the time we're getting this kind of issues for expired sessions
    # (looks like sessions are rather short-lived), for now the choice is to map these errors on 
    # a SESSION_EXPIRED code
    def __getattr__(self, methodName):
        def func(*args, **kwds):
            if (debug): 
                print "entering ManifoldAPI.%s"%methodName,
                print "args",args,
                print "kwds",kwds
            try:
                result=getattr(self.server, methodName)(self.auth, *args, **kwds)
                ### attempt to cope with old APIs and new APIs
                if isinstance (result, dict) and 'code' in result:
                    # this sounds like a result from a new API, leave it untouched
                    pass
                else:
                    if debug:
                        print '<=== backend call', methodName, args, kwds
                        print '.... ctd', 'Authmethod=',self.auth['AuthMethod'], self.url,'->',
                        if not result:                        print "[no/empty result]"
                        elif isinstance (result,str):         print "result is '%s'"%result
                        elif isinstance (result,list):        print "result is a %d-elts list"%len(result)
                        else:                                 print "[dont know how to display result]"
                    return ManifoldResult (code=ManifoldCode.SUCCESS, value=result)
            except xmlrpclib.Fault, error:
                ### xxx this is very rough for now
                # until we have some agreement about how the API calls should return error conditions
                # in some less unpolite way than this anonymous exception, we assume it's a problem with the session
                # that needs to be refreshed
                if error.faultCode == 8002:
                    reason="most likely your session has expired"
                    reason += " (the manifold API has no unambiguous error reporting mechanism yet)"
                    return ManifoldResult (code=ManifoldCode.SESSION_EXPIRED, output=reason)
                else:
                    reason="xmlrpclib.Fault with faultCode = %s (not taken as session expired)"%error.faultCode
                    return ManifoldResult (code=ManifoldCode.UNKNOWN_ERROR, output=reason)
            except Exception,error:
                print "ManifoldAPI: unexpected exception",error
                return ManifoldResult (code=ManifoldCode.UNKNOWN_ERROR, output="%s"%error)
        return func

    def send_manifold_query (self, query):
        (action,subject)= (query.action,query.subject)
        # use e.g. self.Get rather than self.server.Get so we use the __getattr__ code
        if action=='get':
# this makes the backend to squeak and one can't login anymore...
#            return self.Get(subject, query.filters, query.timestamp, query.fields)
            return self.Get(subject, query.filters, {}, query.fields)
        elif action=='update':
            answer=self.Update(subject, query.filters, query.params, query.fields)
            if not isinstance (answer, ManifoldResult): print "UNEXECPECTED answer", answer
            return answer
        else:
            warning="WARNING: ManifoldAPI.send_manifold_query: %s not implemented for now"%action
            print warning
            print 3
            return ManifoldResult(code=ManifoldCode.NOT_IMPLEMENTED, output=warning)
