# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

from manifoldresult import ManifoldResult, ManifoldCode, ManifoldException

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

    # a one-liner to give a hint of what the return value looks like
    def _print_result (self, result):
        if not result:                        print "[no/empty result]"
        elif isinstance (result,str):         print "result is '%s'"%result
        elif isinstance (result,list):        print "result is a %d-elts list"%len(result)
        else:                                 print "[dont know how to display result]"

    # xxx temporary code for scaffolding a ManifolResult on top of an API that does not expose error info
    # as of march 2013 we work with an API that essentially either returns the value, or raises 
    # an xmlrpclib.Fault exception with always the same 8002 code
    # since most of the time we're getting this kind of issues for expired sessions
    # (looks like sessions are rather short-lived), for now the choice is to map these errors on 
    # a SESSION_EXPIRED code
    def __getattr__(self, methodName):
        def func(*args, **kwds):
            try:
                if debug: print "====> ManifoldAPI.%s"%methodName,"args",args,"kwds",kwds
                result=getattr(self.server, methodName)(self.auth, *args, **kwds)
                if debug:
                    print '<==== backend call %s(*%s,**%s) returned'%(methodName,args,kwds),
                    print '.ctd. Authmethod=',self.auth['AuthMethod'], self.url,'->',
                    self._print_result(result)
                ### attempt to cope with old APIs and new APIs
                if isinstance (result, dict) and 'code' in result:
                    if debug: print "taken as new API"
                    # this sounds like a result from a new API
                    # minimal treatment is required, but we do want to turn this into a 
                    # class instance
                    if result['code'] != 2: # in the manifold world, this can be either
                                            # 0 (ok) 1 (partial result) or 2 which means error
                        if debug: print "OK (new API)"
                        return ManifoldResult(code=result['code'], value=result['value'])
                    else:
                        if debug: print "KO (new API) - raising ManifoldException"
                        raise ManifoldException(ManifoldResult(code=result['code'], output=result['description']))
                else:
                    if debug: print "taken as old API"
                    # we're talking to an old API
                    # so if we make it here it should mean success
                    return ManifoldResult (code=ManifoldCode.SUCCESS, value=result)
            except xmlrpclib.Fault, error:
                ### xxx this is very rough for now
                # until we have some agreement about how the API calls should return error conditions
                # in some less unpolite way than this anonymous exception, we assume it's a problem with the session
                # that needs to be refreshed
                if error.faultCode == 8002:
                    if debug: print "KO (old API - 8002) - raising ManifoldException"
                    reason="most likely your session has expired"
                    reason += " (the manifold API has no unambiguous error reporting mechanism yet)"
                    raise ManifoldException ( ManifoldResult (code=ManifoldCode.SESSION_EXPIRED, output=reason))
                else:
                    if debug: print "KO (old API - other) - raising ManifoldException"
                    reason="xmlrpclib.Fault with faultCode = %s (not taken as session expired)"%error.faultCode
                    raise ManifoldException ( ManifoldResult (code=ManifoldCode.UNKNOWN_ERROR, output=reason))
            except Exception,error:
                if debug: print "KO (unexpected exception)",error
                raise ManifoldException ( ManifoldResult (code=ManifoldCode.UNKNOWN_ERROR, output="%s"%error) )
        return func

    def send_manifold_query (self, query):
        # We use a dictionary representation of the query for forwarding it to the API
        ret = self.forward(query.to_dict())
        if debug:
            print "="*80
            print "Result:"
            print ret
            print "="*80
        return ret
