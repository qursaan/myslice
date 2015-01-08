from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from django.views.generic.base      import TemplateView
from unfold.loginrequired import FreeAccessView

from django.http import HttpResponse
from django.shortcuts import render

class LoginWidget(FreeAccessView):
    
    def get(self, request):
        env = {}
        return render_to_response("loginwidget.html", env, context_instance=RequestContext(request))
