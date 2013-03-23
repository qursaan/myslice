class Config:

    # production should use https of course
    manifold_url = "http://manifold.pl.sophia.inria.fr:7080/"

    # exporting these details to js
    @staticmethod
    def manifold_js_export ():
        return "var MANIFOLD_URL = '%s';\n"%Config.manifold_url;
