from django.http                 import HttpResponse
from manifold.core.query         import Query
from manifold.manifoldapi        import execute_query,execute_admin_query
from portal.models               import PendingUser, PendingSlice
import json

# Thierry: moving this right into the code so 
# most people can use myslice without having to install sfa
# XXX tmp sfa dependency, should be moved to SFA gateway
#from sfa.util.xrn                import Xrn 


# Get the list of authorities

def authority_get_pis(request, authority_hrn):
    query = Query.get('authority').filter_by('authority_hrn', '==', authority_hrn).select('pi_users')
    results = execute_query(request, query)
    # NOTE: temporarily commented. Because results is giving empty list. 
    # Needs more debugging
    #if not results:
    #    raise Exception, "Authority not found: %s" % authority_hrn
    #result, = results
    #return result['pi_users']
    return results

def authority_get_pi_emails(request, authority_hrn):
    return ['jordan.auge@lip6.fr', 'loic.baron@lip6.fr']

    pi_users = authority_get_pis(request,authority_hrn)
    pi_user_hrns = [ hrn for x in pi_users for hrn in x['pi_users'] ]
    query = Query.get('user').filter_by('user_hrn', 'included', pi_user_hrns).select('email')
    results = execute_query(request, query)
    print "mails",  [result['email'] for result in results]
    return [result['email'] for result in results]

# SFA add record (user, slice)

def sfa_add_user(request, user_params):
    query = Query.create('user').set(user_params).select('user_hrn')
    results = execute_query(request, query)
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % user_params['hrn']
    return results

def sfa_add_slice(request, slice_params):
    query = Query.create('slice').set(slice_params).select('slice_hrn')
    results = execute_query(request, query)
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

def manifold_update_user(request, user_params):
    # user_params: password, config e.g., 
    query = Query.update('local:user').filter_by('email', '==', request.user.email).set(user_params).select('email')
    results = execute_query(request,query)
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

def manifold_update_account(request,account_params):
    # account_params: config
    query = Query.update('local:account').filter_by('platform', '==', 'myslice').set(account_params).select('user_id')
    results = execute_query(request,query)
    # NOTE: results remains empty and goes to Exception. However, it updates the manifold DB.
    # That's why I commented the exception part. -- Yasin 
    #if not results:
    #    raise Exception, "Failed updating manifold account: config %s" % account_params['config']
    #result, = results
    return results


def manifold_add_platform(request, platform_params):
    query = Query.create('local:platform').set(account_params).select(['user', 'platform'])
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
    request['timestamp'] = slice.created
    request['authority_hrn'] = slice.authority_hrn
    request['slice_name'] = slice.slice_name
    request['number_of_nodes'] = slice.number_of_nodes
    request['type_of_nodes'] = slice.type_of_nodes
    request['purpose'] = slice.purpose
    return request

def make_requests(pending_users, pending_slices):
    print "pending users =", pending_users
    print "pending slices =", pending_slices

    requests = []
    for user in pending_users:
        requests.append(make_request_user(user))
    for slice in pending_slices:
        requests.append(make_request_slice(slice))
    return requests   

def get_request_by_id(ids):
    sorted_ids = { 'user': [], 'slice': [] }
    for type__id in ids:
        type, id = type__id.split('__')
        sorted_ids[type].append(id)
        
    if not ids:
        pending_users  = PendingUser.objects.all()
        pending_slices = PendingSlice.objects.all()
    else:
        pending_users  = PendingUser.objects.filter(id__in=sorted_ids['user']).all()
        pending_slices = PendingSlice.objects.filter(id__in=sorted_ids['slice']).all()

    return make_requests(pending_users, pending_slices)

def get_request_by_authority(authority_hrns):
    if not authority_hrns:
        pending_users  = PendingUser.objects.all()
        pending_slices = PendingSlice.objects.all()
    else:
        pending_users  = PendingUser.objects.filter(authority_hrn__in=authority_hrns).all()
        pending_slices = PendingSlice.objects.filter(authority_hrn__in=authority_hrns).all()

    return make_requests(pending_users, pending_slices)
    
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
                hrn = "%s.%s" % (request['authority_hrn'], request['login'])
                # XXX tmp sfa dependency
                from sfa.util.xrn import Xrn 
                urn = Xrn(hrn, request['type']).get_urn()

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
                    #'pi'        : None,
                    'enabled'    : True
                }
                # ignored in request: id, timestamp, password

                sfa_add_user(wsgi_request, sfa_user_params)

                # XXX Remove from database


                request_status['SFA user'] = {'status': True }

            except Exception, e:
                request_status['SFA user'] = {'status': False, 'description': str(e)}

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

                sfa_slice_params = {
                    'hrn'        : hrn, 
                    'urn'        : urn,
                    'type'       : request['type'],
                    #'slices'    : None,
                    #'researcher': None,
                    #'pi'        : None,
                    'enabled'    : True
                }
                # ignored in request: id, timestamp,  number_of_nodes, type_of_nodes, purpose

                sfa_add_slice(wsgi_request, sfa_slice_params)

                # XXX Remove from database

            
                request_status['SFA slice'] = {'status': True }

            except Exception, e:
                request_status['SFA slice'] = {'status': False, 'description': str(e)}

        status['%s__%s' % (request['type'], request['id'])] = request_status

    return status


def validate_action(request, **kwargs):
    ids = filter(None, kwargs['id'].split('/'))
    status = portal_validate_request(request, ids)
    json_answer = json.dumps(status)
    return HttpResponse (json_answer, mimetype="application/json")

# Django and ajax
# http://djangosnippets.org/snippets/942/
