from django.core.context_processors import csrf
from django.shortcuts               import render_to_response

from django.views.generic.base      import TemplateView
from unfold.loginrequired           import FreeAccessView

class LoginWidget(FreeAccessView):
    
    def get(self, request):
        env = {}
        env.update(csrf(request))
        return render_to_response("loginwidget.html", env)
