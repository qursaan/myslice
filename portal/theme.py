from myslice.configengine import ConfigEngine

class ThemeView (object):
    
    @property
    def theme(self):
        self.config = ConfigEngine()
        if self.config.myslice.theme :
            return self.config.myslice.theme
    
    @property
    def template(self):
        return self.theme + '/' + self.template_name