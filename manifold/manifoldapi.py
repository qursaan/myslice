# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

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

  def __getattr__(self, methodName):
      def func(*args, **kwds):
        result=getattr(self.server, methodName)(self.auth, *args, **kwds)
        ### debug
        if debug:
          print '===> backend call',methodName, self.auth, self.url,'->',
          if not result:                        print "no/empty result"
          elif isinstance (result,str):         print "result is '%s'"%result
          elif isinstance (result,list):        print "result is a %d-elts list"%len(result)
          else:                                 print "dont know how to display result"
        ###
        return result
      return func

  def send_manifold_query (self, manifold_query):
    (action,method)= (manifold_query.action,manifold_query.method)
    if action=='get':
      return self.server.Get(self.auth, method, manifold_query.filters, {}, manifold_query.fields)
    # xxx...
    else:
      print "WARNING: ManifoldAPI.send_manifold_query: only 'get' implemented for now"
    
