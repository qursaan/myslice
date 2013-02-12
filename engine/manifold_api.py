# Manifold API Python interface
import xmlrpclib
from myslice.config import Config

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
           print methodName, self.auth, self.url
           result=getattr(self.proxy, methodName)(self.auth, *args, **kwds)
           return result
      return func
