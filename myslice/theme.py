import os
from myslice.configengine import ConfigEngine
from myslice.settings import TEMPLATE_DIRS

class ThemeView (object):
    
    @property
    def theme(self):
        self.config = ConfigEngine()
        if self.config.myslice.theme :
            return self.config.myslice.theme

    @property
    def label(self):
        self.config = ConfigEngine()
        if self.config.myslice.theme_label :
            return self.config.myslice.theme_label

    @property
    def logo(self):
        self.config = ConfigEngine()
        if self.config.myslice.theme_logo :
            return self.config.myslice.theme_logo
  
    @property
    def template(self):
        # Load a template from the theme directory if it exists
        # else load it from the common templates dir
        #print "THEME = ",self.theme
        #print "TEMPLATE = ",self.template_name
        #print "TEMPLATE_DIRS = ",TEMPLATE_DIRS
        filename = self.theme + '_' + self.template_name
        #print any(os.path.exists(os.path.join(d,filename)) for d in TEMPLATE_DIRS)
        #print (os.path.exists(os.path.join(d,filename)) for d in TEMPLATE_DIRS)
        if any(os.path.exists(os.path.join(d,filename)) for d in TEMPLATE_DIRS):
            return filename
        else:
            return self.template_name
