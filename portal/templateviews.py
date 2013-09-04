from django.contrib.auth.decorators     import login_required
from django.utils.decorators            import method_decorator
from django.http                        import HttpResponseRedirect
# for 'as_view' that we need to call in urls.py and the like
from django.views.generic.base          import TemplateView

from manifold.manifoldresult            import ManifoldException

########## the base class for views that require a login
class LoginRequiredView (TemplateView):

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(LoginRequiredView, self).dispatch(*args, **kwargs)


########## the base class for views that need to protect against ManifoldException
# a decorator for view classes to catch manifold exceptions
# by design views should not directly exercise a manifold query
# given that these are asynchroneous, you would expect a view to just 
# return a mundane skeleton
# however of course this is not always true, 
# e.g. we deal with metadata some other way, and so
# it is often a good idea for a view to monitor these exceptions
# and to take this opportunity to logout people 

def logout_on_manifold_exception (view_as_a_function):
    def wrapped (request, *args, **kwds):
        try:
            return view_as_a_function(request,*args, **kwds)
        except ManifoldException, manifold_result:
            # xxx we need a means to display this message to user...
            from django.contrib.auth import logout
            logout(request)
            return HttpResponseRedirect ('/')
        except Exception, e:
            # xxx we need to sugarcoat this error message in some error template...
            print "Unexpected exception",e
            import traceback
            traceback.print_exc()
            return HttpResponseRedirect ('/')
    return wrapped

# at first sight this matters only for views that require login
# however we prefer this to be explicit
# i.e. a user class has to inherit both LoginRequiredView and LogoutOnManifoldExceptionView

class LogoutOnManifoldExceptionView (TemplateView):

    @logout_on_manifold_exception
    def get (self, request, *args, **kwds):
        return self.get_or_logout (request, *args, **kwds)
