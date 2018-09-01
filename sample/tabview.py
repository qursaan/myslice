from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

from unfold.prelude import Prelude

from ui.topmenu import topmenu_items, the_user
# tmp
from trashutils import lorem, hard_wired_slice_names

from myslice.settings import logger

@login_required
def tab_view (request):
    logger.info("request {}".format(request.__class__))
    logger.info("{}".format(request))
    prelude=Prelude( js_files='js/bootstrap.js', css_files='css/bootstrap.css')

    tab_env = {'title':'Page for playing with Tabs',
               'topmenu_items': topmenu_items('tab',request),
               'username':the_user (request),
               'lorem': lorem,                                
               }

    tab_env.update (prelude.prelude_env())
    return render_to_response ('view-tab.html', tab_env,
                               context_instance=RequestContext(request))

