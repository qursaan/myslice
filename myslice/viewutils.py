# a set of utilities to help make the global layout consistent across views

from copy import deepcopy

standard_topmenu_items = [ 
#    { 'label':'Tab', 'href': '/tab/'},
#    { 'label':'Scroll', 'href': '/scroll/'},
    { 'label':'One Plugin', 'href': '/plugin/'},
    { 'label':'Dashboard', 'href': '/dashboard/'},
    { 'label':'Slice', 'href': '/slice/'},
    ]

#login_out_items = { False: { 'label':'Login', 'href':'/login/'},
#                    True:  { 'label':'Logout', 'href':'/logout/'}}

def topmenu_items (current,request=None):
    result=deepcopy(standard_topmenu_items)
    for d in result:
        if d['label'].lower().find(current)>=0: d['is_active']=True
    if not request: return result
    has_user=request.user.is_authenticated()
#    result.append (login_out_items [ has_user] )
    return result

def the_user (request):
    "This code below is broken"
    if not request.user.is_authenticated (): 
#        print 'void user!'
        return ''
    else: 
        return request.user.email

# temporary for sample views
lorem="""
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod <code>mazim placerat</code> facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.
"""

lorem_p = "<p>"+lorem+"</p>"

hard_wired_slice_names = []
for site in [ 'inria', 'upmc' , 'ibbt' ]:
    for slice in [ 'foo', 'bar', 'tutu', 'test', 'omf', 'heartbeat' ]:
        hard_wired_slice_names.append ("ple.%s.%s"%(site,slice))

# having html tags right here is not a real use case
hard_wired_list=[]
hard_wired_list.append("this hard-wired list")
hard_wired_list.append("is defined")
hard_wired_list.append("in plugins.simplelist.py")
hard_wired_list.append("which in turn relies on")
hard_wired_list.append("template widget-template.html")
hard_wired_list.append("while it should of course")
hard_wired_list.append("instead issue a query")
hard_wired_list.append("and fill the DOM in js from there")
hard_wired_list.append("it would however maybe make sense")
hard_wired_list.append("to offer the option to 'datatablify'")
hard_wired_list.append("the list from the python code")
hard_wired_list.append("just like a standard plugin can be set as visible or not")
hard_wired_list.append("")    
hard_wired_list.append("OTOH and IMHO, there should be two separate and explicit subclasses of SimpleList for slices or testbeds")

quickfilter_criterias = [
    {'key': 'Slice', 'values': ['slice1','slice2']},
    {'key': 'Type', 'values': ['type1','type2']},
    {'key': 'Network', 'values': ['net1','net2']},
    ]
