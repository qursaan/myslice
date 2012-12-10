# Create your views here.
from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

from myslice.viewutils import menu_items, the_user
# tmp
from myslice.viewutils import lorem, hard_wired_slice_names

@login_required
def fake_slice_view (request, name=None):
    title='Fake Slice Page'
    if name: title += " for slice %s"%name
    result=render_to_response ('view-slice.html',
                               {'name':name,
                                'title':title,
                                'menu_items' : menu_items('slice',request),
                                'username':the_user (request),
                                'slices': hard_wired_slice_names,
                                'content_main' : lorem,
                                },
                               context_instance=RequestContext(request))

    return result

@login_required
def tab_view (request):
    return render_to_response ('view-tab.html',
                               {'title':'Page for playing with Tabs',
                                'menu_items': menu_items('tab',request),
                                'username':the_user (request),
                                'lorem': lorem,                                
                                },
                               context_instance=RequestContext(request))

@login_required
def scroll_view (request):
    return render_to_response ('view-scroll.html',
                               {'title':'Toy page for scrolling',
                                'menu_items': menu_items('scroll',request),
                                'username':the_user (request),
                                'lorem':lorem,
                                },
                               context_instance=RequestContext(request))
