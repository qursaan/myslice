from django.shortcuts           import render
from django.views.generic       import View

from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items


# splitting the 2 functions done here
# GET is for displaying the empty form
# POST is to process it once filled - or show the form again if anything is missing
class ExperimentView (FreeAccessView):
    template_name = "experimentview.html"
    def _display (self, request):
        return render(request, 'experimentview.html', {
                'topmenu_items': topmenu_items('experiment', request),
                })


