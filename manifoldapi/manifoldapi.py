# Manifold API Python interface
import copy, xmlrpclib, ssl
from myslice.settings import config, logger, DEBUG

from django.contrib import messages
from django.shortcuts import redirect
from manifoldresult import ManifoldResult, ManifoldCode, ManifoldException
from manifold.core.result_value import ResultValue

debug_deep=False
#debug_deep=True

class ManifoldAPI:

    def __init__(self, auth=None, cainfo=None):
        
        self.auth = auth
        self.cainfo = cainfo
        self.errors = []
        self.trace = []
        self.calls = {}
        self.multicall = False
        self.url = config.manifold_url()
        
        # Manifold uses a self signed certificate
        # https://www.python.org/dev/peps/pep-0476/
        if hasattr(ssl, '_create_unverified_context'): 
            self.server = xmlrpclib.Server(self.url, verbose=False, allow_none=True, context=ssl._create_unverified_context())
        else :
            self.server = xmlrpclib.Server(self.url, verbose=False, allow_none=True)

    # xxx temporary code for scaffolding a ManifolResult on top of an API that does not expose error info
    # as of march 2013 we work with an API that essentially either returns the value, or raises 
    # an xmlrpclib.Fault exception with always the same 8002 code
    # since most of the time we're getting this kind of issues for expired sessions
    # (looks like sessions are rather short-lived), for now the choice is to map these errors on 
    # a SESSION_EXPIRED code
    def __getattr__(self, methodName):

        def func(*args, **kwds):
            import time
            
            start = time.time()
            try:
                
                #logger.debug("MANIFOLD %s( %s( %s ) ) to %s" % (methodName, args[0]['action'], args[0]['object'], self.url))
                
                if ('Username' in self.auth) :
                    username = self.auth['Username']
                else :
                    username = "-"
                
                args += ({ 'authentication': self.auth },)
                                
                result = getattr(self.server, methodName)(*args, **kwds)
                
                logger.debug("MANIFOLD %s( %s( %s ) ) as %s to %s executed in %s seconds -> %s" % 
                             (methodName, 
                              args[0]['action'] or '', 
                              args[0]['object'] or '',
                              username,
                              self.url, 
                              (time.time() - start),
                              args))

                return ResultValue(**result)

            except Exception, error:
                if True: 
                    print "===== xmlrpc catch-all exception:", error
                    import traceback
                    traceback.print_exc(limit=3)
                
                if "Connection refused" in error:
                    raise ManifoldException ( ManifoldResult (code=ManifoldCode.SERVER_UNREACHABLE,
                                                              output="%s answered %s" % (self.url,error)))
                # otherwise
                logger.error("MANIFOLD %s( %s( %s ) ) as %s to %s executed in %s seconds -> %s" % 
                             (methodName, 
                              args[0]['action'] or '', 
                              args[0]['object'] or '',
                              username,
                              self.url, 
                              (time.time() - start),
                              args))
                logger.error("MANIFOLD %s", error)
                raise ManifoldException ( ManifoldResult (code = ManifoldCode.SERVER_UNREACHABLE, output = "%s" % error) )

        return func

def _execute_query(request, query, manifold_api_session_auth):
    
    manifold_api = ManifoldAPI(auth = manifold_api_session_auth)
    
    logger.debug("MANIFOLD QUERY : %s" % " ".join(str(query).split()))
    #logger.debug("MANIFOLD DICT : %s" % query.to_dict())
    result = manifold_api.forward(query.to_dict())
    if result['code'] == 2:
        # this is gross; at the very least we need to logout() 
        # but most importantly there is a need to refine that test, since 
        # code==2 does not necessarily mean an expired session
        # XXX only if we know it is the issue
        del request.session['manifold']
        # Flush django session
        request.session.flush()
        #raise Exception, 'Error running query: %r' % result
    
    if result['code'] == 1:
        log.warning("MANIFOLD : %s" % result['description'])

    # XXX Handle errors
    #Error running query: {'origin': [0, 'XMLRPCAPI'], 'code': 2, 'description': 'No such session: No row was found for one()', 'traceback': 'Traceback (most recent call last):\n  File "/usr/local/lib/python2.7/dist-packages/manifold/core/xmlrpc_api.py", line 68, in xmlrpc_forward\n    user = Auth(auth).check()\n  File "/usr/local/lib/python2.7/dist-packages/manifold/auth/__init__.py", line 245, in check\n    return self.auth_method.check()\n  File "/usr/local/lib/python2.7/dist-packages/manifold/auth/__init__.py", line 95, in check\n    raise AuthenticationFailure, "No such session: %s" % e\nAuthenticationFailure: No such session: No row was found for one()\n', 'type': 2, 'ts': None, 'value': None}

    return result['value'] 

def execute_query(request, query):
    if not 'manifold' in request.session or not 'auth' in request.session['manifold']:
        request.session.flush()
        #raise Exception, "User not authenticated"
        host = request.get_host()
        return redirect('/')
    
    manifold_api_session_auth = request.session['manifold']['auth']
    
    return _execute_query(request, query, manifold_api_session_auth)

def execute_admin_query(request, query):
    admin_user, admin_password = config.manifold_admin_user_password()
    admin_auth = {'AuthMethod': 'password', 'Username': admin_user, 'AuthString': admin_password}
    return _execute_query(request, query, admin_auth)
