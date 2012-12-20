from django.template.loader import render_to_string

from engine.composite import Composite

class VerticalLayout (Composite) :
    
    def title (self) : return "VLayout title"

    def template (self):        return "verticallayout.html"
