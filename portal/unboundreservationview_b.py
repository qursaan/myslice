from .                          import forms
from django.shortcuts           import render, render_to_response
from django.template            import RequestContext
from django.template.loader     import render_to_string
from django.views.generic       import View
from django.core.mail           import send_mail
from myslice.configengine       import ConfigEngine
from unfold.loginrequired       import FreeAccessView
from ui.topmenu                 import topmenu_items, the_user
from myslice.theme              import ThemeView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
#from portal.forms               import ReputationForm
import json, ast
from pprint                     import pprint
from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_query,execute_admin_query
from portal.actions             import is_pi, create_slice, create_pending_slice, clear_user_creds
from django.utils               import simplejson
from django.http                import *
import numpy
import json
import logging
import StringIO
import pycurl
from apgl.graph import *
from apgl.generator.ErdosRenyiGenerator import ErdosRenyiGenerator
from django.views.decorators.csrf import csrf_exempt
import time
import datetime
import calendar
# splitting the 2 functions done here
# GET is for displaying the empty form
# POST is to process it once filled - or show the form again if anything is missing
def create_post(request):
    print(request.user)
    if request.method == 'POST':
        post_text = request.POST.get('the_post')
        response_data = {}

        post = Post(text=post_text, author=request.user)
        post.save()

        response_data['result'] = 'Create post successful!'
       

    return HttpResponse(
           json.dumps(response_data),
           content_type="application/json"
           )
                                               

def response_mimetype(request):
    
    
    if "application/json" in request.META['HTTP_ACCEPT']:
        return "application/json"
    else:
        return "text/plain"

def connected_graph(vert,possib):
    
    ################################################
    # Connected graph calculation 
    #
    #    Requirements for ErdosRenyiGenerator python function
    #
    #    apt-get install gfortran libopenblas-dev liblapack-dev
    #    pip install numpy
    #    pip install scipy
    #    pip install apgl
    ################################################## 
        p = possib
        vertices= vert
#graph = SparseGraph(VertexList(vertices, 1))
#generator = ErdosRenyiGenerator(p, selfEdges=False)

#for i in range(0,10):
        found = False;

        time_start = time.time()
        iter_time = 20
        while not found and time.time()-time_start < iter_time:
                graph = SparseGraph(VertexList(vertices, 1))
                generator = ErdosRenyiGenerator(p, selfEdges=False)
                graph = generator.generate2(graph)
                #print 'getAllEdges'
                #print graph.getAllEdges()
                #print '-----------'

                connected_list=[]
                #print graph.findConnectedComponents()
                for list in graph.findConnectedComponents():
                    if len(list)==vertices:
                        connected_list=list
                        break
                if len(connected_list)==vertices:
                    links = {}
                    edge_lst =  graph.getAllEdges()
                    for item in range(0, len(edge_lst)):
                        links[item]=str(edge_lst[item][0]), str(edge_lst[item][1])
                    break
        if len(connected_list)==vertices:
            return links
        else:
            return ("not_found")
        #print graph.getAllEdges()
        #print connected_list
        return links


class UnboundReservationView (FreeAccessView, ThemeView):
        def my_view(request):

            preset_form = forms.PresetListForm()

            return render_to_response('services.html', {'array': json.dumps(data, cls=SpecialEncoder),'preset_form': preset_form,
        })
	def create_post(request):
	    print(request.user)	
	    if request.method == 'POST':
		print("mlsllslssll,sls*************")
		post_text = request.POST.get('the_post')
		response_data = {}

		post = Post(text=post_text, author=request.user)
		post.save()

		response_data['result'] = 'Create post successful!'
       

		return HttpResponse(
		json.dumps(response_data),
		content_type="application/json"
                                               )
	    else:
                return HttpResponse(
                json.dumps({"nothing to see": "this isn't happening"}),
                content_type="application/json"
        )
    
        def quiz_guess(request, fact_id):   
	    message = {"fact_type": "", "fact_note": ""}
	    if request.is_ajax():
	        fact = get_object_or_404(Fact, id=fact_id)
	        message['fact_type'] = fact.type
	        message['fact_note'] = fact.note
            else:
	        message = "You're the lying type, I can just tell."
	        json = simplejson.dumps(message)
	        return HttpResponse(json, mimetype='application/json')
	def default_env (self):
	    return { 
	            'MANIFOLD_URL':ConfigEngine().manifold_url(),
	            }	    
        def post (self, request):
	        env = self.default_env()
	        print(request.user)
	        print(request.POST["b"])
		
		body1= request.POST["mitsos"]
		user_urn= request.POST["name"]
		user_urn=str(user_urn)
		print(user_urn)
		buffer = StringIO.StringIO()
		json_data=open('/home/coyiotis/test.json').read()
		data1 = json.loads(json_data)
		data=json.dumps(body1)
		data2=str(unicode(data))
		json_data_1 = json.loads(body1)
		json_data_1=json.dumps(json_data_1)
		json_data_1 =str(unicode(json_data_1))
		#print(data)       
		print('*******************************nikos')  	
		#print(json_data_1)
		#print(json_data_1['data'])
		if request.POST["b"]=="1":
		    c = pycurl.Curl()
		    c.setopt(pycurl.URL, 'https://194.177.207.2:8001/mapper/')
		    c.setopt(pycurl.HTTPHEADER, ['Content-Type: application/json','Accept: application/json'])
		    c.setopt(pycurl.POST, 1)
		    c.setopt(pycurl.SSL_VERIFYPEER, False)
		    c.setopt(pycurl.SSL_VERIFYHOST, False)        
		    c.setopt(pycurl.POSTFIELDS, body1)
		    c.setopt(pycurl.WRITEDATA, buffer)
		    c.perform()
		    c.close()
		    global body
		    body = buffer.getvalue()
			# Body is a string in some encoding.
			# In Python 2, we can print it without knowing what the encoding is.
		#print(body)	
		    env['responsejson'] =  json.dumps(body)
		
		    body = body.replace('\n', '')
		#body = body.replace(' ', '')
		#print(json.dumps(body))
		    print(body)
                #j = json.loads(body)
		##print json_string
		#parent =  j["resource_response"]
		#for item in parent:
		  #  print item["name"]
		  #  print item["type"]

		    global decoded
		    decoded = json.loads(body)
 
		# pretty printing of json-formatted string
		    print json.dumps(decoded, sort_keys=True, indent=4)
 
		    print "JSON parsing example: ", decoded['resource_response']
		#print len(item_dict['result'][0]['run'])
		else:
		    leases_list=[]
		    slice_params={}
		    resources=[]
		    final_params={}
		
		    for x in xrange(0, len(decoded['resource_response']['resources'])):
			end_time=decoded['resource_response']['resources'][x]['valid_until']
			start_time=decoded['resource_response']['resources'][x]['valid_from']
		    #s = "01/12/2011"
			start_time=int(time.mktime(datetime.datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S %Z").timetuple()))
			end_time=int(time.mktime(datetime.datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S %Z").timetuple()))
			print(start_time)
			print(end_time)
		    #print(calendar.timegm(start_time.utctimetuple()))
		   
			urn=decoded['resource_response']['resources'][x]['urn']
			slice_params = {
				    'resource'         : urn,
				    'start_time'       : start_time,
				    'end_time'         : end_time
			}
			leases_list.append(slice_params)
			resources.append(urn)
		   
		    print("chrysaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") 
		    for keys,values in slice_params.items():
    			print(keys)
    			print(values)
 
			final_params = {
			'resource'        : resources,
			'lease'        : leases_list
		    }    
		    #final_params=str(final_params)
		#final_params=[{'resource': resources, 'leases':leases_list}]
		#print(final_params)
		
	            print(user_urn)		
		    final_params= ast.literal_eval(json.dumps(final_params))
		    query = Query.update('slice').filter_by('slice_hrn', '==', user_urn).set(final_params).select('slice_hrn')
		#query = Query.update('myslice:slice').filter_by('slice_hrn', '==', user_urn).set(slice_params).select('slice_hrn')
		    results = execute_query(request,query)
		    print("________________________________________________________________________________")
		    print(results)
		    print('________________________________________________________________________________')
		    print(query)
		return HttpResponse(json.dumps(body), mimetype='application/json')
		#return render_to_response('workflow.html', env, context_instance=RequestContext(request))
		#return render(request, 'workflow.html', {"variable_int" : 12})
	def get (self, request):
	        buffer = StringIO.StringIO()
		print("mlsllslssll,sls*************3")
		#message = {"fact_type": "", "fact_note": ""}
		childs = []
		
		
				
	           
		    
	        if request.is_ajax():
	            print("mlsllslssll,sls*************4")
		        #fact = get_object_or_404(Fact, id=fact_id)
		    #    message['fact_type'] = fact.type
		    #    message['fact_note'] = fact.note
		#else:
		#	message = "You're the lying type, I can just tell."
		#	json = simplejson.dumps(message)	    
		if request.GET.has_key('node-num2'):
                        child1=""
			child="{\"type\":\"Node\",\"valid_form\":"+request.GET['fromdate']+",\"valid_until\":"+request.GET['todate']+",\"exclusive\": true}"
			for index in range(int(request.GET['node-num'])):
					    childs.append(child)
			                    if index>1:
							child1=child1+",{\"type\":\"Node\",\"valid_form\":"+"\""+request.GET['fromdate']+"\""+",\"valid_until\":"+"\""+request.GET['todate']+"\""+",\"exclusive\":true}"
			                    if index==0:
							child1="{\"type\":\"Node\",\"valid_form\":"+"\""+request.GET['fromdate']+"\""+",\"valid_until\":"+"\""+request.GET['todate']+"\""+",\"exclusive\":true}"
			
			
			
			response_dict={}
			jchilds="{\"resources\":["+child1+"]\"\"}"
			#print(request.GET['jsondata'])
			c = pycurl.Curl()
			c.setopt(pycurl.URL, 'https://194.177.207.2:8001/mapper/')
			c.setopt(pycurl.HTTPHEADER, ['Content-Type: application/json','Accept: application/json'])
			c.setopt(pycurl.POST, 1)
			c.setopt(pycurl.SSL_VERIFYPEER, False)
			c.setopt(pycurl.SSL_VERIFYHOST, False)        
			c.setopt(pycurl.POSTFIELDS, request.GET['jsondata'])
			c.setopt(pycurl.WRITEDATA, buffer)
			c.perform()
			c.close()
						
			body = buffer.getvalue()
			
			#return HttpResponse(json.dumps(body), mimetype='application/json')
			#response_dict = {'1':request.GET['node-
			#jnum'], '2':request.GET['node-num2']}
			#links = connected_graph(int(request.GET['node-num']),float(request.GET['node-num2'])/100)
            #===================================================================
                #for item in range(0,len(links)):
		#child[item]=links[item]
            #=====  =============================================================
            		#print response_dict
			jsonchilds=json.dumps(childs)
			links=0
			json_stuff = simplejson.dumps({'links': links, 'body': body})
			print '**********************************BP 1 *********************************'+request.GET['jsondata']
			print '**********************************BP 2 *********************************'+body
			if links == 'not_found':
			#return HttpResponse(simplejson.dumps(['false']), content_type = response_mimetype(self.request))
				return HttpResponse(content='false', mimetype=DEFAULT_CONTENT_TYPE)
			else:
				return HttpResponse(json_stuff, content_type = response_mimetype(self.request))
            	#return HttpResponse(simplejson.dumps(response_dict), mimetype='application/javascript')
		#return HttpResponse(json, mimetype='application/json')
	        return self._display (request)
	
	def _display (self, request):
        	return render(request, 'workflow_b.html', {
                'topmenu_items': topmenu_items('Unbound Request', request),
                'username': the_user (request)
                })
 
        


    
