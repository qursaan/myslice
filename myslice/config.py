class Config:

    # production should use https of course

# this version of unfold expects a backend that runs a new API
# xxx
# -- although currently (april 2013) there are missing features
# e.g. GetSession and GetPersons are still there -- they should go away
# also the code for retrieving metadata does not work as-is
#    manifold_url = "http://localhost:7080/"
    manifold_url = "http://dev.myslice.info:7080/"

    # exporting these details to js
    @staticmethod
    def manifold_js_export ():
        return "var MANIFOLD_URL = '%s';\n"%Config.manifold_url;
