from django.template.loader import render_to_string

from unfold.composite import Composite

class Stack (Composite) :
    
    def template_file (self):        return "stack.html"
