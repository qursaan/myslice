import os.path
from ConfigParser import RawConfigParser
from myslice.settings import ROOT

# as this code suggests, you have the option to override these defaults
# by writing a file myslice/myslice.ini
# that looks like this
#[manifold]
#url = http://manifold.pl.sophia.inria.fr:7080/
#admin_user = admin
#admin_password = admin

# use a singleton instead of staticmethods
from manifold.util.singleton    import Singleton

class Config(object):
    __metaclass__ = Singleton

    # the OpenLab-wide backend as managed by UPMC
    # xxx production should probably use https of course
    default_manifold_url = "http://test.myslice.info:7080/"
    # the devel/unstable version runs on "http://dev.myslice.info:7080/"
    # if you use a development backend running on this box, use "http://localhost:7080/"
    # the INRIA setup is with "http://manifold.pl.sophia.inria.fr:7080/"

    default_manifold_admin_user     = 'admin'
    default_manifold_admin_password = 'demo'


    def __init__ (self):
        parser = RawConfigParser ()
        parser.add_section('manifold')
        parser.set ('manifold', 'url', Config.default_manifold_url)
        parser.set ('manifold', 'admin_user', Config.default_manifold_admin_user)
        parser.set ('manifold', 'admin_password', Config.default_manifold_admin_password)
        parser.read (os.path.join(ROOT,'myslice/myslice.ini'))
        self.config_parser=parser

    def manifold_url (self):
        return self.config_parser.get('manifold','url')

    def manifold_admin_user_password(self):
        return (self.config_parser.get('manifold','admin_user'),
                self.config_parser.get('manifold','admin_password'))

    # exporting these details to js
    def manifold_js_export (self):
        return "var MANIFOLD_URL = '%s';\n"%self.manifold_url();
