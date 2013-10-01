import os.path
from ConfigParser import RawConfigParser
from myslice.settings import ROOT

# as this code suggests, you have the option to write myslice/myslice.ini
# that looks like this
#[manifold]
#url = http://manifold.pl.sophia.inria.fr:7080/

class Config:

    # the OpenLab-wide backend as managed by UPMC
    # xxx production should probably use https of course
    default_manifold_url = "http://test.myslice.info:7080/"
    # the devel/unstable version runs on "http://dev.myslice.info:7080/"
    # if you use a development backend running on this box, use "http://localhost:7080/"
    # the INRIA setup is with "http://manifold.pl.sophia.inria.fr:7080/"

    _config_parser = None

    # having grown tired of screwing up with git stashes 
    # taking away my local config, we now more properly use
    # an external config file to override teh default
    @staticmethod
    def manifold_url ():
        if Config._config_parser: 
            return Config._config_parser.get('manifold','url')
        config = RawConfigParser ()
        config.add_section('manifold')
        config.set ('manifold', 'url', Config.default_manifold_url)
        config.read (os.path.join(ROOT,'myslice/myslice.ini'))
        Config._config_parser=config
        return Config.manifold_url()

    # exporting these details to js
    @staticmethod
    def manifold_js_export ():
        return "var MANIFOLD_URL = '%s';\n"%Config.manifold_url();
