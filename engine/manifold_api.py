# Manifold API Python interface
import xmlrpclib
#from util.config import Config

class ManifoldAPI:

  def __init__(self, auth=None, cainfo=None):

    #config = Config()
    self.auth = auth
    #self.server = config.server
    #self.port = config.port
    #self.path = config.path
    self.server = 'demo.myslice.info'
    self.port = '7080'
    self.path = '/'
    self.cainfo = cainfo
    self.errors = []
    self.trace = []
    self.calls = {}
    self.multicall = False
    self.url = "http://"+self.server+":"+self.port+"/"
    self.proxy = xmlrpclib.Server(self.url, verbose=False, allow_none=True)

  def __getattr__(self, methodName):
      def func(*args, **kwds):
           print methodName, self.auth, self.url
           result=getattr(self.proxy, methodName)(self.auth, *args, **kwds)
           return result
      return func