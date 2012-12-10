from engine.plugin import Plugin

class SimpleList (Plugin) :
    
    def render_content (self):
        return """<ul><li>hard-wired one</li><li>manual two</li>
<li>this is defined</li>
<li>in plugins.simplelist.py</li>
</ul>"""
