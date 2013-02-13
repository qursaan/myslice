class Config:

    manifold_server = 'manifold.pl.sophia.inria.fr'
#    manifold_server = 'demo.myslice.info'
    manifold_port = '7080'
    manifold_path = '/'

    @staticmethod
    def manifold_url (): 
        return "http://%s:%s%s"%(Config.manifold_server,Config.manifold_port,Config.manifold_path)
