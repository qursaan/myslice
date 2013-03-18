# Create your views here.
from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

from unfold.prelude import Prelude

from myslice.viewutils import topmenu_items, the_user
# tmp
from myslice.viewutils import lorem, hard_wired_slice_names

@login_required
def tab_view (request):
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

def scroll_view (request):
    return render_to_response ('view-scroll.html',
                               {'title':'Toy page for scrolling',
                                'topmenu_items': topmenu_items('scroll',request),
                                'username':the_user (request),
                                'lorem':lorem,
                                },
                               context_instance=RequestContext(request))

# we take name from the URL and propagate in the template
@login_required
def slice_view (request, name=None):
    title='Fake Slice Page'
    if name: title += " for slice %s"%name
    result=render_to_response ('view-slice.html',
                               {'name':name,
                                'title':title,
                                'topmenu_items' : topmenu_items('slice',request),
                                'username':the_user (request),
                                'slices': hard_wired_slice_names,
                                'content_main' : lorem,
                                },
                               context_instance=RequestContext(request))

    return result
