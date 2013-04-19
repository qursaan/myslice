class Config:

    # production should use https of course

# an old-fashioned API - that's what is currently only supported   
    manifold_url = "http://manifold.pl.sophia.inria.fr:7080/"
# this one runs a new API, but currently (april 2013) there are missing
# features; GetSession and GetPersons are still there (they should go away) and 
# the code for retrieving metadata does not work as-is, and I have no clue 
# what it should become anyways, so...
#    manifold_url = "http://dev.myslice.info:7080/"

    # exporting these details to js
    @staticmethod
    def manifold_js_export ():
        return "var MANIFOLD_URL = '%s';\n"%Config.manifold_url;
