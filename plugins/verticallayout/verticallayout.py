from django.template.loader import render_to_string

from engine.composite import Composite

class VerticalLayout (Composite) :
    
    def template_file (self):        return "verticallayout.html"
