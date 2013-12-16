from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

from unfold.prelude import Prelude

from ui.topmenu import topmenu_items, the_user
# tmp
from trash.trashutils import lorem, hard_wired_slice_names

@login_required
def tab_view (request):
    print "request", request.__class__
    print request
    prelude=Prelude( js_files='js/bootstrap.js', css_files='css/bootstrap.css')
    prelude_env = prelude.prelude_env()

    tab_env = {'title':'Page for playing with Tabs',
               'topmenu_items': topmenu_items('tab',request),
               'username':the_user (request),
               'lorem': lorem,                                
               }
    tab_env.update (prelude_env)
    return render_to_response ('view-tab.html', tab_env,
                               context_instance=RequestContext(request))

