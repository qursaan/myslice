from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from unfold.loginrequired           import LoginRequiredView

from theme import ThemeView

class TestbedList (LoginRequiredView, ThemeView):
    template_name = "testbed-list.html"
    
    def get(self, request, slicename):
        return render_to_response(self.template, {"theme": self.theme, "username": request.user, "slice" : slicename, "section":"testbeds"}, context_instance=RequestContext(request))
