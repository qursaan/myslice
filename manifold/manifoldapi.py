# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

from django.contrib import messages
from manifoldresult import ManifoldResult, ManifoldCode, ManifoldException
from manifold.core.result_value import ResultValue

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
                if debug: print "====> ManifoldAPI.%s"%methodName,"auth",self.auth,"args",args,"kwds",kwds
                result=getattr(self.server, methodName)(self.auth, *args, **kwds)
                if debug:
                    print '<==== backend call %s(*%s,**%s) returned'%(methodName,args,kwds),
                    print '.ctd. Authmethod=',self.auth['AuthMethod'], self.url,'->',
                    self._print_result(result)

                return ResultValue(**result)

            except Exception,error:
                # XXX Connection refused for example
                print "** API ERROR **"
                import traceback
                traceback.print_exc()
                if debug: print "KO (unexpected exception)",error
                raise ManifoldException ( ManifoldResult (code=ManifoldCode.UNKNOWN_ERROR, output="%s"%error) )

        return func

def execute_query(request, query):
    if not 'manifold' in request.session or not 'auth' in request.session['manifold']:
        print "W: Used hardcoded demo account for execute_query"
        manifold_api_session_auth = {'AuthMethod': 'password', 'Username': 'demo', 'AuthString': 'demo'}
    else:
        manifold_api_session_auth = request.session['manifold']['auth']
    manifold_api = ManifoldAPI(auth=manifold_api_session_auth)
    print "-"*80
    print query
    print query.to_dict()
    print "-"*80
    result = manifold_api.forward(query.to_dict())
    if result['code'] == 2:
        raise Exception, 'Error running query'
    return result['value'] 
