from django.contrib.auth        import authenticate, login, logout
from django.template            import RequestContext
from django.shortcuts           import render, render_to_response

from manifoldapi.manifoldresult import ManifoldResult
from ui.topmenu                 import topmenu_items, the_user
from myslice.configengine       import ConfigEngine
from manifold.core.query        import Query
from unfold.page                import Page
from manifoldapi.manifoldapi    import execute_admin_query, execute_query
from unfold.loginrequired       import LoginRequiredAutoLogoutView

from myslice.theme import ThemeView
import json
import hashlib
import datetime
import urllib2
import ast
from django.views.decorators.csrf import csrf_exempt
from django.http                  import *

def response_mimetype(request):
        
    if "application/json" in request.META['HTTP_ACCEPT']:
        return "application/json"
    else:
        return "text/plain"
    

def json_to_rest(url, data ):
        
    req = urllib2.Request(url)
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, json.dumps(data))
    
    if data == "a":
        mylist = ast.literal_eval(response.read())
    else:
        mylist = response.read().translate(None, '"[]').split(",")
        
    return (mylist)


def unix_to_timestamp(timest):
    try:
        return datetime.datetime.fromtimestamp(int(timest)).strftime('%Y-%m-%d %H:%M:%S')
    except:
        return timest

def timestamp_to_unix(timest):
    try:
        pass
    except:
        pass
    
    
def slice_to_exp(slices_users):
    experiments = {}
    testbeds = {}
    
    
    for slice in slices_users:
        nodes={}
        leases = slice['lease']
        if leases is not None:
            for lease in leases:
                resource = lease['resource']
                start_t = lease['start_time']
                end_t = lease['end_time']
                #node = lease['resource']
                
                testbed_start = resource.index('IDN+')+4
                testbed_end = resource.index('+node+')
                
                testbed = resource[testbed_start:testbed_end]
                node = resource[testbed_end+6:]
                
                if testbed in testbeds:
                    if node not in testbeds[testbed]:
                        testbeds[testbed].append(node)
                else:
                    testbeds[testbed] = [node]
                
                #group nodes in consecutive timeslots
                if not node in nodes:       
                    nodes[node]={str(start_t):{'start_t':start_t, 'nodes':node, 'end_t':end_t}}
                else:
                    if not str(start_t) in nodes[node]:
                        f=0
                        for n in nodes[node]:
                            if n[str(end_t)] == start_t:
                                n[str(end_t)] == end_t
                                f=1
                        if f==0:
                            nodes[node][str(start_t)]={'start_t':start_t, 'nodes':node, 'end_t':end_t}
                        
        #group grouped nodes in experiments
        for n in nodes:
            for exp in nodes[n]:
                key = str(exp) + str(nodes[n][exp]['end_t'])
                
                if key not in experiments:
                    experiments[key]={'slice_hrn':slice['slice_hrn'], \
                                      'start':nodes[n][exp]['start_t'], 'end':nodes[n][exp]['end_t'], 'nodes':[nodes[n][exp]['nodes']]}   
                elif nodes[n][exp]['end_t'] == experiments[key]['end']:
                    experiments[key]['nodes'].append(nodes[n][exp]['nodes'])
                    
    return (experiments,testbeds)
   
class ReputationView (LoginRequiredAutoLogoutView, ThemeView):
    template_name = 'reputation.html'
        
    # expose this so we can mention the backend URL on the welcome page
    def default_env (self):
        return { 
                 'MANIFOLD_URL':ConfigEngine().manifold_url(),
                 }

    def post (self,request):
        env = self.default_env()
        env['theme'] = self.theme
        
        
        
        with open('/home/coyiotis/testlog.log') as f:
            f.write(str('test'))
                
                
        return render_to_response(self.template, env, context_instance=RequestContext(request))


    
    
    def get (self, request, state=None):
        env = self.default_env()
                
        #####    *** Reputation Plugin-specific START       ***     ############
        with open('/home/coyiotis/testlog.log', 'w') as f:
                f.write(str(request.GET))
                for key in request.GET:
                    f.write('\n')
                    f.write(str(request.GET[key]))
                    
        #The following 'if' is a dirty way for bypassing the JS AJAX cross-domain prevention policy...not pretty
        if request.GET.has_key(u'slicedata[user_eval][overall]'):
            dict_to_send = {}
            dict_to_send['eid'] = str(request.GET[u'slicedata[id]'])
            dict_to_send['slice_hrn'] = str(request.GET[u'slicedata[slice_hrn]'])
            dict_to_send['user_hrn'] = str(request.GET[u'slicedata[user_hrn]'])
            dict_to_send['start_tunix'] = str(request.GET[u'slicedata[start_tunix]'])
            dict_to_send['end_tunix'] = str(request.GET[u'slicedata[end_tunix]'])
            dict_to_send['start_t'] = str(request.GET[u'slicedata[start_t]'])
            dict_to_send['end_t'] = str(request.GET[u'slicedata[end_t]'])
            dict_to_send['testbeds'] = ast.literal_eval(str(request.GET[u'testbeds']))
            dict_to_send['user_eval'] = {}
            dict_to_send['user_eval']['reuse'] = str(request.GET[u'slicedata[user_eval][reuse]'])
            dict_to_send['user_eval']['availability'] = str(request.GET[u'slicedata[user_eval][availability]'])
            dict_to_send['user_eval']['pay'] = str(request.GET[u'slicedata[user_eval][pay]'])
            dict_to_send['user_eval']['support'] = str(request.GET[u'slicedata[user_eval][support]'])
            dict_to_send['user_eval']['overall'] = str(request.GET[u'slicedata[user_eval][overall]'])
            dict_to_send['user_eval']['link_quality'] = str(request.GET[u'slicedata[user_eval][link_quality]'])
            dict_to_send['user_eval']['problems'] = str(request.GET[u'slicedata[user_eval][problems]'])
            dict_to_send['user_eval']['quality'] = str(request.GET[u'slicedata[user_eval][quality]'])
            
            slicedata_received = json_to_rest('http://survivor.lab.netmode.ntua.gr:4567/reputation/json', dict_to_send )
                        
            return HttpResponse(json.dumps(slicedata_received), content_type = response_mimetype(self.request))

                
        slices_users = []
        
        #get slices
        userslice_query = Query().get('slice').select('slice_urn', 'slice_hrn', 'users', 'resource', 'lease')
        slice_details = execute_query(self.request, userslice_query)
        
        #get local users
        local_user_query  = Query().get('local:user').select('email','status','config')
        local_user_details = execute_admin_query(self.request, local_user_query)
        
        #get users - create dict[email]=hrn
        user_query  = Query().get('user').select('user_hrn','user_urn','user_email')
        user_details = execute_admin_query(self.request, user_query)
        users_hrn = {}
        for item in user_details:
            users_hrn[item['user_email']] = item['user_hrn']
        
        #get currenct username (email)
        if request.user.is_authenticated():
            cur_username = request.user.username  
        
        #get a list of all the slices for the logged in user
        testbeds = []

        for slice in slice_details:

            if users_hrn[cur_username] in slice['users']:
                slices_users.append({'slice_hrn':slice['slice_hrn'], 'user':cur_username, 'user_hrn':users_hrn[cur_username] \
                                     , 'resource':slice['resource'], 'lease':slice['lease'] })  
                
                             
        env['slices_users'] = slices_users  ### For logging
       
        #####create slicelist for template & JSON
        experiments,testbeds =  slice_to_exp(slices_users)
    
        all_exp = []
        iddata = []
                          
        for exp in experiments:
            experiment = {}
            experiment['slice_hrn'] = experiments[exp]['slice_hrn']
            experiment['user_hrn'] = users_hrn[cur_username]
            experiment['start_tunix'] = experiments[exp]['start']
            experiment['end_tunix'] = experiments[exp]['end']
            experiment['start_t'] = unix_to_timestamp(experiments[exp]['start'])
            experiment['end_t'] = unix_to_timestamp(experiments[exp]['end'])
            experiment['testbeds'] = {}
            for exp_node in experiments[exp]['nodes']:
                list_testbeds = [ key for key,val in testbeds.items()]
                for tkey in list_testbeds:
                    if exp_node in testbeds[tkey]:
                        if tkey in experiment['testbeds']:
                            if exp_node not in experiment['testbeds'][tkey]:
                                experiment['testbeds'][tkey].append(exp_node)
                        else:
                            experiment['testbeds'][tkey] = [exp_node]
            tempid = hashlib.sha1(str(experiment)).hexdigest()                    
            experiment['id'] = tempid
            
            iddata.append(tempid)
            all_exp.append(experiment)
        
        
        ###### Check which experiments have not been rated yet. Pop from all_exp any experiment that has already been rated
        unrated_exp = json_to_rest('http://survivor.lab.netmode.ntua.gr:4567/reputation/qid', iddata)    
        
        for item in all_exp:
            if item['id'] in unrated_exp:
                pass
            else:
                all_exp.pop(all_exp.index(item))



        ###### Get Reputation values from Reputation DB
        reps = json_to_rest('http://survivor.lab.netmode.ntua.gr:4567/reputation/showrep', "a")
        env['logging_test'] = reps    
        
        services = []
        for item in reps:
            for serv in item['services']:
                if serv.keys()[0] not in services:
                    services.append(serv.keys()[0])
        
        
        #in json, sevices are in the form: 'services':[{'serv1':x}, {'serv2':y}], so we transform it to 'services':[x,y] based on
        # the services dict above. If for a specific service there is no applicable value, we put N/A            
        for testbed in reps:
            d = list(testbed['services'])
            del testbed['services']
            testbed['services'] = []
            for s in services:
                set_v = 0
                for i in d:
                    try:
                        testbed['services'].append(i[s])
                        set_v=1
                    except:
                        pass
                if set_v == 0 :
                    testbed['services'].append('N/A')
                
        ###### Pass variables to template
        env['logging_test'] = json.dumps(all_exp, ensure_ascii=False)
        env['reputation'] = reps
        env['rep_serv'] = services
        env['slicelist'] = all_exp
        env['json_data'] = json.dumps(all_exp, ensure_ascii=False)
        
        ######    *** Reputation Plugin-specific END       ***     ############
        
        
        if request.user.is_authenticated(): 
            env['person'] = self.request.user
        else: 
            env['person'] = None
    
        env['theme'] = self.theme
        #env['user_list']= user_list

        env['username']=the_user(request)
        env['topmenu_items'] = topmenu_items(None, request)
        if state: env['state'] = state
        elif not env['username']: env['state'] = None
        # use one or two columns for the layout - not logged in users will see the login prompt
        env['layout_1_or_2']="layout-unfold2.html" if not env['username'] else "layout-unfold1.html"        
        
        return render_to_response(self.template, env, context_instance=RequestContext(request))
    


    

                    
                    
                    
                    
            