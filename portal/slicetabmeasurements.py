from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from unfold.loginrequired           import LoginRequiredView

from myslice.theme import ThemeView

class SliceTabMeasurements (LoginRequiredView, ThemeView):
    template_name = "slice-tab-measurements.html"
    
    def get(self, request, slicename):
        return render_to_response(self.template, {"theme": self.theme, "username": request.user, "slicename" : slicename, "section":"measurements"}, context_instance=RequestContext(request))
