from engine.plugin import Plugin

class SimpleList (Plugin) :
    
    def render_content (self):
        return """<ul><li>this hard-wired list</li>
<li>is defined</li>
<li>in plugins.simplelist.py</li>
<li>while it should of course</li>
<li>instead issue a query</li>
<li>and fill the DOM in js from there</li>
<li>it would however maybe make sense</li>
<li>to offer the option to 'datatablify'</li>
<li>the list from the python code</li>
<li>just like a standard plugin can be set as visible or not</li>
<li>IMHO there should be explicit subclasses of SimpleList for slices or testbeds</li>
</ul>"""
