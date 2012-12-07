# Create your views here.
from copy import deepcopy

from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

lorem="""
Lorem <span class='bold'>ipsum dolor</span> sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod <code>mazim placerat</code> facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.
"""

standard_menu_items = [ { 'label':'Sample view', 'href': '/sample/'},
                        { 'label':'Slice view',  'href': '/slice/'},
                        { 'label':'Scroll view', 'href': '/scroll/'},
                        ]

def menu_items (current):
    result=deepcopy(standard_menu_items)
    for d in result:
        if d['label'].lower().find(current)>=0: d['active']=True
    print "menu_items(%s)=%s"%(current,result)
    return result
    

hard_wired_slice_names = []
hard_wired_slice_names.append ('ple.inria.foo')
hard_wired_slice_names.append ('ple.inria.bar')
hard_wired_slice_names.append ('ple.inria.tutu')
hard_wired_slice_names.append ('ple.upmc.foo')
hard_wired_slice_names.append ('ple.upmc.bar')
hard_wired_slice_names.append ('ple.upmc.tutu')
hard_wired_slice_names.append ('ple.ibbt.foo')
hard_wired_slice_names.append ('ple.ibbt.bar')
hard_wired_slice_names.append ('ple.ibbt.tutu')

def fake_slice_view (request, name=None):
    result=render_to_response('slice.html',
                              {'foo':'var_foo_set_in_view', 
                               'name':name,
                               'slices': hard_wired_slice_names,
                               'content_main' : lorem,
                               'menu_items' : menu_items('slice'),
                               },
                              context_instance=RequestContext(request))

    return result

def sample_tab (request):
    return render_to_response ('sample-tab.html',
                               { 'lorem': lorem,
                                 'menu_items': menu_items('sample'),
                                 },
                               context_instance=RequestContext(request))

def sample_scroll (request):
    return render_to_response ('sample-scroll.html',
                               { 'lorem':lorem,
                                 'menu_items': menu_items('scroll'),
                                 },
                               context_instance=RequestContext(request))
