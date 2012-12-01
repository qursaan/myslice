# Create your views here.
from django.core.context_processors import csrf
from django.template import RequestContext
from django.template.loader import render_to_string
from django.shortcuts import render_to_response

lorem="""
Lorem <span class='bold'>ipsum dolor</span> sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum."""

def fake_view (request, name=None):
    result=render_to_response('slice.html',{'foo':'bar', 
                                            'name':name,
                                            'content_main' : lorem,
                                            'menu_items' : 
                                            [ { 'label':'item1', 'href': '/url1/'},
                                              { 'label':'Other item', 'href': '/other/'},
                                              ]},
                              context_instance=RequestContext(request))

    return result

def sample (request):
    return render_to_response ('sample.html',
                               { 'lorem': lorem,
                                 'menu_items':
                                     [ { 'label':'Some label', 'href': '/url1/','active':True, },
                                       { 'label':'Another topic ', 'href': '/other/'},
                                       ]},
                               context_instance=RequestContext(request))
