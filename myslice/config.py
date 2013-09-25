class Config:

# this version of unfold expects a backend that runs a new API

# production should probably use https of course


# if you use a development backend running on this box
#    manifold_url = "http://localhost:7080/"
# the INRIA setup
#    manifold_url = "http://manifold.pl.sophia.inria.fr:7080/"
# the OpenLab-wide backend as managed by UPMC
#   manifold_url = "http://dev.myslice.info:7080/" # development version
#   manifold_url = "http://test.myslice.info:7080/" #stable version
    manifold_url = "http://localhost:7080/" #stable version
    
    # exporting these details to js
    @staticmethod
    def manifold_js_export ():
        return "var MANIFOLD_URL = '%s';\n"%Config.manifold_url;
