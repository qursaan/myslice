from django.template.loader import render_to_string

from engine.plugin import Plugin

class SimpleList (Plugin) :
    
    def render_content (self, request):
        return render_to_string ("widget-simplelist.html",
                                 self._settings)
