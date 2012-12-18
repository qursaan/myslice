from django.template.loader import render_to_string

from engine.plugin import Plugin

class SimpleList (Plugin) :

    def template (self):        return "simplelist.html"

    def media_js ():            return [ 'js/simplelist.js' ]

    def media_css ():           return { 'all': ('css/simplelist.css'), }

    # SimpleList is useless per se anyways
    def title (self) : return "Title for Simple List"
