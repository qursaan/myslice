from django.http                 import HttpResponse
from manifold.core.query         import Query
from manifoldapi.manifoldapi        import execute_query,execute_admin_query
from portal.models               import PendingUser, PendingSlice, PendingAuthority
import json

# Thierry: moving this right into the code so 
# most people can use myslice without having to install sfa
# XXX tmp sfa dependency, should be moved to SFA gateway
#from sfa.util.xrn                import Xrn 


# Get the list of authorities

def authority_get_pis(request, authority_hrn):
    query = Query.get('authority').filter_by('authority_hrn', '==', authority_hrn).select('pi_users')
    results = execute_admin_query(request, query)
    # NOTE: temporarily commented. Because results is giving empty list. 
    # Needs more debugging
    #if not results:
    #    raise Exception, "Authority not found: %s" % authority_hrn
    #result, = results
    #return result['pi_users']
    return results

def authority_get_pi_emails(request, authority_hrn):
    #return ['jordan.auge@lip6.fr', 'loic.baron@lip6.fr']
    pi_users = authority_get_pis(request,authority_hrn)
    if any(d['pi_users'] == None for d in pi_users):
        return ['support@myslice.info']
    else:
        pi_user_hrns = [ hrn for x in pi_users for hrn in x['pi_users'] ]
        query = Query.get('user').filter_by('user_hrn', 'included', pi_user_hrns).select('email')
        results = execute_admin_query(request, query)
        print "mails",  [result['email'] for result in results]
        return [result['email'] for result in results]

# SFA get record

def sfa_get_user(request, user_hrn, pub):
    query_sfa_user = Query.get('user').filter_by('user_hrn', '==', user_hrn)
    result_sfa_user = execute_query(request, query_sfa_user)
    return result_sfa_user                        

# SFA add record (user, slice)

def sfa_add_user(request, user_params):
    if 'email' in user_params:
        user_params['user_email'] = user_params['email']
    query = Query.create('user').set(user_params).select('user_hrn')
    results = execute_query(request, query)
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % user_params['hrn']
    return results

def sfa_update_user(request, user_hrn, user_params):
    # user_params: keys [public_key] 
    if 'email' in user_params:
        user_params['user_email'] = user_params['email']
    query = Query.update('user').filter_by('user_hrn', '==', user_hrn).set(user_params).select('user_hrn')
    results = execute_query(request,query)
    return results

def sfa_add_slice(request, slice_params):
    query = Query.create('slice').set(slice_params).select('slice_hrn')
    results = execute_query(request, query)
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % slice_params['hrn']
    return results

def sfa_add_authority(request, authority_params):
    query = Query.create('authority').set(authority_params).select('authority_hrn')
    results = execute_query(request, query)
    print "sfa_add_auth results=",results
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % authority_params['hrn']
    return results

def sfa_add_user_to_slice(request, user_hrn, slice_params):
# UPDATE myslice:slice SET researcher=['ple.upmc.jordan_auge','ple.inria.thierry_parmentelat','ple.upmc.loic_baron','ple.upmc.ciro_scognamiglio','ple.upmc.mohammed-yasin_rahman','ple.upmc.azerty'] where slice_hrn=='ple.upmc.myslicedemo'
    query_current_users = Query.get('slice').select('user').filter_by('slice_hrn','==',slice_params['hrn'])
    results_current_users = execute_query(request, query_current_users)
    slice_params['researcher'] = slice_params['researcher'] | results_current_users
    query = Query.update('slice').filter_by('user_hrn', '==', user_hrn).set(slice_params).select('slice_hrn')
    results = execute_query(request, query)
# Also possible but not supported yet
# UPDATE myslice:user SET slice=['ple.upmc.agent','ple.upmc.myslicedemo','ple.upmc.tophat'] where user_hrn=='ple.upmc.azerty'
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % slice_params['hrn']
    return results

# Propose hrn

def manifold_add_user(request, user_params):
    # user_params: email, password e.g., user_params = {'email':'aa@aa.com','password':'demo'}
    query = Query.create('local:user').set(user_params).select('email')
    results = execute_admin_query(request, query)
    if not results:
        raise Exception, "Failed creating manifold user: %s" % user_params['email']
    result, = results
    return result['email']

def manifold_update_user(request, email, user_params):
    # user_params: password, config e.g., 
    query = Query.update('local:user').filter_by('email', '==', email).set(user_params).select('email')
    results = execute_admin_query(request,query)
    # NOTE: results remains empty and goes to Exception. However, it updates the manifold DB.
    # That's why I commented the exception part. -- Yasin 
    #if not results:
    #    raise Exception, "Failed updating manifold user: %s" % user_params['email']
    #result, = results
    return results

def manifold_add_account(request, account_params):
    query = Query.create('local:account').set(account_params).select(['user', 'platform'])
    results = execute_admin_query(request,query)
    if not results:
        raise Exception, "Failed creating manifold account on platform %s for user: %s" % (account_params['platform'], account_params['user'])
    result, = results
    return result['user_id']

def manifold_update_account(request,user_id,account_params):
    # account_params: config
    query = Query.update('local:account').filter_by('platform', '==', 'myslice').filter_by('user_id', '==', user_id).set(account_params).select('user_id')
    results = execute_admin_query(request,query)
    return results

#explicitly mention the platform_id
def manifold_delete_account(request, platform_id, user_id, account_params):
    query = Query.delete('local:account').filter_by('platform_id', '==', platform_id).filter_by('user_id', '==', user_id).set(account_params).select('user_id')
    results = execute_admin_query(request,query)
    return results


#not tested
def manifold_add_platform(request, platform_params):
    query = Query.create('local:platform').set(platform_params).select(['user', 'platform'])
    results = execute_admin_query(request,query)
    if not results:
        raise Exception, "Failed creating manifold  platform %s for user: %s" % (platform_params['platform'], platform_params['user'])
    result, = results
    return result['platform_id']


def make_request_user(user):
    request = {}
    request['type']          = 'user'
    request['id']            = user.id
    request['timestamp']     = user.created # XXX in DB ?
    request['authority_hrn'] = user.authority_hrn
    request['first_name']    = user.first_name
    request['last_name']     = user.last_name
    request['email']         = user.email
    request['login']         = user.login
    request['keypair']       = user.keypair
    return request

def make_request_slice(slice):
    request = {}
    request['type'] = 'slice'
    request['id'] = slice.id
    request['user_hrn'] = slice.user_hrn
    request['timestamp'] = slice.created
    request['authority_hrn'] = slice.authority_hrn
    request['slice_name'] = slice.slice_name
    request['number_of_nodes'] = slice.number_of_nodes
    request['type_of_nodes'] = slice.type_of_nodes
    request['purpose'] = slice.purpose
    return request

def make_request_authority(authority):
    request = {}
    request['type']                  = 'authority'
    request['id']                    = authority.id
    request['site_name']             = authority.site_name
    request['site_latitude']         = authority.site_latitude
    request['site_longitude']        = authority.site_longitude
    request['site_url']              = authority.site_url
    request['site_authority']        = authority.site_authority
    request['site_abbreviated_name'] = authority.site_abbreviated_name
    request['address_line1']         = authority.address_line1
    request['address_line2']         = authority.address_line2
    request['address_line3']         = authority.address_line3
    request['address_city']          = authority.address_city
    request['address_postalcode']    = authority.address_postalcode
    request['address_state']         = authority.address_state
    request['address_country']       = authority.address_country
    request['authority_hrn']         = authority.authority_hrn
    request['timestamp']             = authority.created
    return request

def make_requests(pending_users, pending_slices, pending_authorities):
    requests = []
    for user in pending_users:
        requests.append(make_request_user(user))
    for slice in pending_slices:
        requests.append(make_request_slice(slice))
    for authority in pending_authorities:
        requests.append(make_request_authority(authority))
    return requests   

def get_request_by_id(ids):
    sorted_ids = { 'user': [], 'slice': [], 'authority': [] }
    for type__id in ids:
        type, id = type__id.split('__')
        sorted_ids[type].append(id)
        
    if not ids:
        pending_users  = PendingUser.objects.all()
        pending_slices = PendingSlice.objects.all()
        pending_authorities = PendingAuthority.objects.all()
    else:
        pending_users  = PendingUser.objects.filter(id__in=sorted_ids['user']).all()
        pending_slices = PendingSlice.objects.filter(id__in=sorted_ids['slice']).all()
        pending_authorities = PendingAuthority.objects.filter(id__in=sorted_ids['authority']).all()

    return make_requests(pending_users, pending_slices, pending_authorities)

def get_requests(authority_hrns=None):
    print "get_request_by_authority auth_hrns = ", authority_hrns
    if not authority_hrns:
        pending_users  = PendingUser.objects.all()
        pending_slices = PendingSlice.objects.all()
        pending_authorities = PendingAuthority.objects.all()
    else:
        pending_users  = PendingUser.objects.filter(authority_hrn__in=authority_hrns).all()
        pending_slices = PendingSlice.objects.filter(authority_hrn__in=authority_hrns).all()
        pending_authorities = PendingAuthority.objects.filter(authority_hrn__in=authority_hrns).all()

    return make_requests(pending_users, pending_slices, pending_authorities)

# XXX Is it in sync with the form fields ?

def portal_validate_request(wsgi_request, request_ids):
    status = {}

    if not isinstance(request_ids, list):
        request_ids = [request_ids]

    requests = get_request_by_id(request_ids)
    for request in requests:
        # type, id, timestamp, details, allowed -- MISSING: authority_hrn
        # CAREFUL about details
        # user  : first name, last name, email, password, keypair
        # slice : number of nodes, type of nodes, purpose
        
        request_status = {}

        print "REQUEST", request
        if request['type'] == 'user':

            try:
                # XXX tmp user_hrn inside the keypair column of pendiguser table
                hrn = json.loads(request['keypair'])['user_hrn']
                #hrn = "%s.%s" % (request['authority_hrn'], request['login'])
                # XXX tmp sfa dependency
                from sfa.util.xrn import Xrn 
                urn = Xrn(hrn, request['type']).get_urn()
                if 'pi' in request:
                    auth_pi = request['pi']
                else:
                    auth_pi = ''
                sfa_user_params = {
                    'hrn'        : hrn, 
                    'urn'        : urn,
                    'type'       : request['type'],
                    'keys'       : [json.loads(request['keypair'])['user_public_key']],
                    'first_name' : request['first_name'],
                    'last_name'  : request['last_name'],
                    'email'      : request['email'],
                    #'slices'    : None,
                    #'researcher': None,
                    'pi'         : [auth_pi],
                    'enabled'    : True
                }
                # ignored in request: id, timestamp, password
                
                # ADD USER TO SFA Registry
                sfa_add_user(wsgi_request, sfa_user_params)

                # USER INFO
                user_query  = Query().get('local:user').select('user_id','config','email','status').filter_by('email', '==', request['email'])
                user_details = execute_admin_query(request, user_query)
                #print user_details[0]

                # UPDATE USER STATUS = 2
                manifold_user_params = {
                    'status': 2
                }
                manifold_update_user(request, request['email'], manifold_user_params) 

                # USER MAIN ACCOUNT != reference
                #print 'USER MAIN ACCOUNT != reference'
                list_accounts_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config')\
                    .filter_by('user_id','==',user_details[0]['user_id'])\
                    .filter_by('auth_type','!=','reference')    
                list_accounts = execute_admin_query(request, list_accounts_query)
                #print "List accounts = ",list_accounts
                for account in list_accounts:
                    main_platform_query  = Query().get('local:platform').select('platform_id','platform').filter_by('platform_id','==',account['platform_id'])
                    main_platform = execute_admin_query(request, main_platform_query)

                # ADD REFERENCE ACCOUNTS ON SFA ENABLED PLATFORMS                        
                #print 'ADD REFERENCE ACCOUNTS ON SFA ENABLED PLATFORMS'
                platforms_query  = Query().get('local:platform').filter_by('disabled', '==', '0').filter_by('gateway_type','==','sfa').select('platform_id','gateway_type')
                platforms = execute_admin_query(request, platforms_query)
                #print "platforms SFA ENABLED = ",platforms
                for platform in platforms:
                    #print "add reference to platform ",platform
                    manifold_account_params = {
                        'user_id': user_details[0]['user_id'],
                        'platform_id': platform['platform_id'],
                        'auth_type': 'reference',
                        'config': '{"reference_platform": "' + main_platform[0]['platform'] + '"}',
                    }
                    manifold_add_account(request, manifold_account_params)
        
                request_status['SFA user'] = {'status': True }

            except Exception, e:
                 request_status['SFA user'] = {'status': False, 'description': str(e)}
                       
#            user_params = {'status':2}
#            manifold_update_user(request, request['email'], user_params)

            # MANIFOLD user should be added beforehand, during registration
            #try:
            #    manifold_user_params = { key: request[key] for key in MANIFOLD_USER_KEYS }
            #    # XXX # manifold_add_user(manifold_user_params)
            #    request_status['MySlice user'] = {'status': True }
            #except Exception, e:
            #    request_status['MySlice user'] = {'status': False, 'description': str(e)}

            # XXX
            #manifold_account_params = { key: request[key] for key in MANIFOLD_ACCOUNT_KEYS }
            #manifold_add_account(manifold_account_params)
            #request_status['MySlice testbed accounts'] = {'status': False }

        elif request['type'] == 'slice':
            try:
                hrn = "%s.%s" % (request['authority_hrn'], request['slice_name'])
                # XXX tmp sfa dependency
                from sfa.util.xrn import Xrn 
                urn = Xrn(hrn, request['type']).get_urn()
                
                # Add User to Slice if we have the user_hrn in pendingslice table
                if 'user_hrn' in request:
                    user_hrn = request['user_hrn']
                    print "Slice %s will be created for %s" % (hrn,request['user_hrn'])
                else:
                    user_hrn=''
                    print "Slice %s will be created without users %s" % (hrn)
                sfa_slice_params = {
                    'hrn'        : hrn, 
                    'urn'        : urn,
                    'type'       : request['type'],
                    #'slices'    : None,
                    'researcher' : [user_hrn],
                    #'pi'        : None,
                    'enabled'    : True
                }
                # ignored in request: id, timestamp,  number_of_nodes, type_of_nodes, purpose

                sfa_add_slice(wsgi_request, sfa_slice_params)
                #sfa_add_user_to_slice(wsgi_request, user_hrn, sfa_slice_params)
                request_status['SFA slice'] = {'status': True }

            except Exception, e:
                request_status['SFA slice'] = {'status': False, 'description': str(e)}

        elif request['type'] == 'authority':
            try:
                #hrn = "%s.%s" % (request['authority_hrn'], request['site_authority'])
                hrn = request['site_authority']
                # XXX tmp sfa dependency
                from sfa.util.xrn import Xrn 
                urn = Xrn(hrn, request['type']).get_urn()

                sfa_authority_params = {
                    'hrn'        : hrn,
                    'urn'        : urn,
                    'type'       : request['type'],
                    #'pi'        : None,
                    'enabled'    : True
                }
                print "ADD Authority"
                sfa_add_authority(wsgi_request, sfa_authority_params)
                request_status['SFA authority'] = {'status': True }

            except Exception, e:
                request_status['SFA authority'] = {'status': False, 'description': str(e)}

        # XXX Remove from Pendings in database

        status['%s__%s' % (request['type'], request['id'])] = request_status

    return status


def validate_action(request, **kwargs):
    ids = filter(None, kwargs['id'].split('/'))
    status = portal_validate_request(request, ids)
    json_answer = json.dumps(status)
    return HttpResponse (json_answer, mimetype="application/json")

# Django and ajax
# http://djangosnippets.org/snippets/942/
