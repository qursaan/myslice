import os.path
from ConfigParser import RawConfigParser
from myslice.settings import ROOT

#
# DO NOT EDIT !!!
#
# This file does not contain any user-modifiable data
#
# te defaults here are, well, only default values, 
# and, you have the option to override them
# by writing a file myslice/myslice.ini
# that looks like this
#[manifold]
#url = http://manifold.pl.sophia.inria.fr:7080/
#admin_user = admin
#admin_password = admin
#[googlemap]
#api_key=theapikeyasprovidedbygoogle

# use a singleton instead of staticmethods
from manifold.util.singleton    import Singleton

class ConfigEngine(object):
    __metaclass__ = Singleton

    # the OpenLab-wide backend as managed by UPMC
    # xxx production should probably use https of course
    default_manifold_url = "https://test.myslice.info:7080/"
    # the devel/unstable version runs on "https://dev.myslice.info:7080/"
    # if you use a development backend running on this box, use "http://localhost:7080/"
    # the INRIA setup is with "https://manifold.pl.sophia.inria.fr:7080/"

    default_manifold_admin_user     = 'admin'
    default_manifold_admin_password = 'demo'
    default_myslice_theme           = 'onelab'

    #iotlab dev url
    default_iotlab_url = "https://devgrenoble.senslab.info/rest/admin/users"
    default_iotlab_admin_user = "xxx"
    default_iotlab_admin_password= "yyy"

    def __init__ (self):
        parser = RawConfigParser ()
        parser.add_section('manifold')
        parser.set ('manifold', 'url', ConfigEngine.default_manifold_url)
        parser.set ('manifold', 'admin_user', ConfigEngine.default_manifold_admin_user)
        parser.set ('manifold', 'admin_password', ConfigEngine.default_manifold_admin_password)

        parser.add_section('myslice')
        parser.set ('myslice', 'theme', ConfigEngine.default_myslice_theme)

        parser.add_section('iotlab')
        parser.set ('iotlab', 'url', ConfigEngine.default_iotlab_url)
        parser.set ('iotlab', 'admin_user', ConfigEngine.default_iotlab_admin_user)
        parser.set ('iotlab', 'admin_password', ConfigEngine.default_iotlab_admin_password)

        parser.add_section('googlemap')
        parser.set ('googlemap','api_key', None)
        parser.read (os.path.join(ROOT,'myslice/myslice.ini'))
        self.config_parser=parser

    def __getattr__(self, section):
        if self.config_parser.has_section(section):
            return ConfigSection(self.config_parser, section)
        
    def manifold_url (self):
        return self.config_parser.get('manifold','url')

    def manifold_admin_user_password(self):
        return (self.config_parser.get('manifold','admin_user'),
                self.config_parser.get('manifold','admin_password'))

    def iotlab_url (self):
        return self.config_parser.get('iotlab','url')

    def iotlab_admin_user(self):
        return self.config_parser.get('iotlab','admin_user')

    def iotlab_admin_password(self):
        return self.config_parser.get('iotlab','admin_password')

    def googlemap_api_key (self):
        return self.config_parser.get('googlemap','api_key')

    # exporting these details to js
    def manifold_js_export (self):
        return "var MANIFOLD_URL = '%s';\n"%self.manifold_url();

class ConfigSection(object) :
    
    def __init__(self, parser, section):
        self._parser = parser
        self._section = section
    
    def __getattr__(self, key):
        if self._parser.has_option(self._section, key):
            return self._parser.get(self._section, key)
