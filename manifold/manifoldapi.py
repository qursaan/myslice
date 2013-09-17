# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

from django.contrib import messages
from manifoldresult import ManifoldResult, ManifoldCode, ManifoldException
from manifold.core.result_value import ResultValue

debug=False
debug=True

def mytruncate (obj, l):
    # we will add '..' 
    l1=l-2
    repr="%s"%obj
    return (repr[:l1]+'..') if len(repr)>l1 else repr

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
        elif isinstance (result,dict):        
            print "result is a dict with %d keys : %s"%(len(result),result.keys())
            for (k,v) in result.iteritems(): 
                if v is None: continue
                print '+++',k,':',mytruncate (v,60)
        else:                                 print "[dont know how to display result] %s"%result

    # xxx temporary code for scaffolding a ManifolResult on top of an API that does not expose error info
    # as of march 2013 we work with an API that essentially either returns the value, or raises 
    # an xmlrpclib.Fault exception with always the same 8002 code
    # since most of the time we're getting this kind of issues for expired sessions
    # (looks like sessions are rather short-lived), for now the choice is to map these errors on 
    # a SESSION_EXPIRED code
    def __getattr__(self, methodName):
        def func(*args, **kwds):
            try:
                if debug:
                    print "====> ManifoldAPI.%s"%methodName,"auth",self.auth,"args",args,"kwds",kwds
                result=getattr(self.server, methodName)(self.auth, *args, **kwds)
                if debug:
                    print '<==== backend call %s(*%s,**%s) returned'%(methodName,args,kwds),
                    print '.ctd. Authmethod=',self.auth['AuthMethod'], self.url,'->',
                    self._print_result(result)
                    print '===== ManifoldAPI call done'

                return ResultValue(**result)

            except Exception,error:
                if "Connection refused" in error:
                    raise ManifoldException ( ManifoldResult (code=ManifoldCode.SERVER_UNREACHABLE,
                                                              output="%s answered %s"%(self.url,error)))
                # otherwise
                print "** MANIFOLD API ERROR **"
                import traceback
                traceback.print_exc()
                if debug: print "KO (unexpected exception)",error
                raise ManifoldException ( ManifoldResult (code=ManifoldCode.UNKNOWN_ERROR, output="%s"%error) )

        return func

def execute_query(request, query):
    if not 'manifold' in request.session or not 'auth' in request.session['manifold']:
        print "W: Using hardcoded demo account for execute_query"
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
        raise Exception, 'Error running query: %r' % result

    # XXX Handle errors
    #Error running query: {'origin': [0, 'XMLRPCAPI'], 'code': 2, 'description': 'No such session: No row was found for one()', 'traceback': 'Traceback (most recent call last):\n  File "/usr/local/lib/python2.7/dist-packages/manifold/core/xmlrpc_api.py", line 68, in xmlrpc_forward\n    user = Auth(auth).check()\n  File "/usr/local/lib/python2.7/dist-packages/manifold/auth/__init__.py", line 245, in check\n    return self.auth_method.check()\n  File "/usr/local/lib/python2.7/dist-packages/manifold/auth/__init__.py", line 95, in check\n    raise AuthenticationFailure, "No such session: %s" % e\nAuthenticationFailure: No such session: No row was found for one()\n', 'type': 2, 'ts': None, 'value': None}


    return result['value'] 
