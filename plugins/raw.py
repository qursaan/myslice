from engine.plugin import Plugin

# usage Raw (html="some html text")

class Raw (Plugin):

    def render_content (self, request):
        return self.get_setting('html')
