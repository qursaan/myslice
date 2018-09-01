from unfold.loginrequired   import LoginRequiredView
from myslice.theme          import ThemeView
from django.shortcuts import render_to_response
from django.template import RequestContext

class OMNView (LoginRequiredView, ThemeView):
    template_name = 'omn/gui.html'
    def get (self, request, slicename=None, state=None):
         username = self.request.user
         my_var = "loading..."
 
         env = { 'theme' : self.theme,
                 'my_var': my_var,
                 'request':self.request,
               }
         return render_to_response(self.template, env, context_instance=RequestContext(request))

