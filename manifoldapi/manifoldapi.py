# Manifold API Python interface
import copy
import xmlrpclib
import ssl

from django.contrib import messages
from django.shortcuts import redirect

from manifold.core.result_value import ResultValue
from manifoldresult import ManifoldResult, ManifoldCode, ManifoldException, truncate_result

from unfold.sessioncache import SessionCache

from myslice.settings import config, logger

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
            self.server = xmlrpclib.Server(self.url, verbose=False, allow_none=True,
                                           context=ssl._create_unverified_context())
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
            
            # the message to display
            auth_message = "<AuthMethod not set in {}>".format(self.auth) if 'AuthMethod' not in self.auth \
                           else "[session]" if self.auth['AuthMethod'] == 'session' \
                           else "user:{}".format(self.auth['Username']) if self.auth['AuthMethod'] == 'password' \
                           else "anonymous" if self.auth['AuthMethod'] == 'anonymous' \
                           else "[???]" + "{}".format(self.auth)
            end_message = "MANIFOLD <- {}( {}( {} ) ) with auth={} to {}"\
                          .format(methodName,
                                  args[0]['action'] or '', 
                                  args[0]['object'] or '',
                                  auth_message,
                                  self.url)
            try:
                args += ({ 'authentication': self.auth },)
                result = getattr(self.server, methodName)(*args, **kwds)
                logger.debug("{} executed in {} seconds -> {}"\
                             .format(end_message, time.time() - start, truncate_result(result)))
                return ResultValue(**result)

            except Exception as error:
                logger.error("===== xmlrpc catch-all exception: {}".format(error))
                import traceback
                logger.error(traceback.format_exc(limit=3))
                
                if "Connection refused" in error:
                    raise ManifoldException ( ManifoldResult (code=ManifoldCode.SERVER_UNREACHABLE,
                                                              output="{} answered {}".format(self.url, error)))
                # otherwise
                logger.error("{} FAILED - executed in {} seconds"\
                             .format(end_message, time.time() - start)) 
                logger.error("MANIFOLD {}".format(error))
                raise ManifoldException ( ManifoldResult (code = ManifoldCode.SERVER_UNREACHABLE,
                                                          output = "{}".format(error)))

        return func

def _execute_query(request, query, manifold_api_session_auth):
    
    manifold_api = ManifoldAPI(auth = manifold_api_session_auth)
    
    logger.debug("MANIFOLD -> QUERY : {}".format(" ".join(str(query).split())))
    result = manifold_api.forward(query.to_dict())
    if result['code'] == 2:
        # this is gross; at the very least we need to logout() 
        # but most importantly there is a need to refine that test, since 
        # code==2 does not necessarily mean an expired session
        # XXX only if we know it is the issue
        SessionCache().end_session(request)
        # Flush django session
        request.session.flush()
        #raise Exception, 'Error running query: {}'.format(result)
    
    if result['code'] == 1:
        log.warning("MANIFOLD : {}".format(result['description']))

    # XXX Handle errors
    #Error running query: {'origin': [0, 'XMLRPCAPI'], 'code': 2, 'description': 'No such session: No row was found for one()', 'traceback': 'Traceback (most recent call last):\n  File "/usr/local/lib/python2.7/dist-packages/manifold/core/xmlrpc_api.py", line 68, in xmlrpc_forward\n    user = Auth(auth).check()\n  File "/usr/local/lib/python2.7/dist-packages/manifold/auth/__init__.py", line 245, in check\n    return self.auth_method.check()\n  File "/usr/local/lib/python2.7/dist-packages/manifold/auth/__init__.py", line 95, in check\n    raise AuthenticationFailure, "No such session: %s" % e\nAuthenticationFailure: No such session: No row was found for one()\n', 'type': 2, 'ts': None, 'value': None}

    return result['value'] 

def execute_query(request, query):
    
    manifold_api_session_auth = SessionCache().get_auth(request)
    if not manifold_api_session_auth:
        request.session.flush()
        #raise Exception, "User not authenticated"
        host = request.get_host()
        return redirect('/')
    
    return _execute_query(request, query, manifold_api_session_auth)

def execute_admin_query(request, query):
    admin_user, admin_password = config.manifold_admin_user_password()
    if not admin_user or not admin_password:
        logger.error("""CONFIG: you need to setup admin_user and admin_password in myslice.ini
Some functions won't work properly until you do so""")
    admin_auth = {'AuthMethod': 'password', 'Username': admin_user, 'AuthString': admin_password}
    return _execute_query(request, query, admin_auth)
