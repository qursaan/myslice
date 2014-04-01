from django.template                 import RequestContext
from django.shortcuts                import render_to_response

from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from django.views.generic.base      import TemplateView

from unfold.loginrequired           import LoginRequiredView
from django.http import HttpResponse
from django.shortcuts import render

from unfold.page                     import Page
from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from myslice.theme import ThemeView

class SliceView (LoginRequiredView, ThemeView):
    template_name = "slice-view.html"
    
    def get(self, request, slicename):
        return render_to_response(self.template, {"slice": slicename, "theme": self.theme, "username": request.user, "section": "Slice %s" % slicename }, context_instance=RequestContext(request))
