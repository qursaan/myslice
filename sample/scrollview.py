from django.core.context_processors import csrf
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

from unfold.prelude import Prelude

from ui.topmenu import topmenu_items, the_user
# tmp
from trash.trashutils import lorem, hard_wired_slice_names

def scroll_view (request):
    return render_to_response ('view-scroll.html',
                               {'title':'Toy page for scrolling',
                                'topmenu_items': topmenu_items('scroll',request),
                                'username':the_user (request),
                                'lorem':lorem,
                                },
                               context_instance=RequestContext(request))

