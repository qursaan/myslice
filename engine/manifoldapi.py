# Manifold API Python interface
import xmlrpclib

from myslice.config import Config

debug=True

class ManifoldAPI:

  def __init__(self, auth=None, cainfo=None):

    config = Config()
    self.auth = auth
    self.server = config.manifold_server
    self.port = config.manifold_port
    self.path = config.manifold_path
    self.cainfo = cainfo
    self.errors = []
    self.trace = []
    self.calls = {}
    self.multicall = False
    self.url = config.manifold_url()
    self.proxy = xmlrpclib.Server(self.url, verbose=False, allow_none=True)

  def __getattr__(self, methodName):
      def func(*args, **kwds):
        result=getattr(self.proxy, methodName)(self.auth, *args, **kwds)
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

  # 4amine : xxx
  def send_manifold_query (self, manifold_query):
    (action,method)= (manifold_query.action,manifold_query.method)
    if action=='get':
      return self.proxy.Get(self.auth, method, manifold_query.filters, {}, manifold_query.fields)
    # xxx...
    elif action=='others':
      return None

    
