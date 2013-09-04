from django.http                 import HttpResponse
from manifold.core.query         import Query
from manifold.manifoldapi        import execute_query
from portal.models               import PendingUser, PendingSlice
import json

# Get the list of authorities

def authority_get_pis(authority_hrn):
    query = Query.get('authority').filter_by('authority_hrn', '==', authority_hrn).select('pi_users')
    results = execute_query(query)
    if not results:
        raise Exception, "Authority not found: %s" % authority_hrn
    result, = results
    return result['pi_users']

def authority_get_pi_emails(authority_hrn):
    user_hrns = authority_get_pis(authority_hrn)
    
    query = Query.get('user').filter_by('user_hrn', 'included', user_hrns).select('user_email')
    results = execute_query(query)
    
    return [result['user_email'] for result in results]

# SFA add record (user, slice)

def sfa_add_user(user_params):
    # sfi.py add --xrn=fed4fire.upmc.timur_friedman --type=user --key=/root/.sfi/timur.pub --email=timur.friedman@lip6.fr --extra=first_name=Timur --extra=last_name=Friedman --extra=enabled=true
    # user_params: xrn type key email + first_name last_name enabled
    query = Query.create('user').set(user_params).select('user_hrn')
    results = execute_query(query)
    if not results:
        raise Exception, "Failed creating SFA user: %s" % user_params['user_hrn']
    result, = results
    return result['user_hrn']

def sfa_add_slice(slice_params):
    pass

# Propose hrn

def manifold_add_user(request, user_params):
    # user_params: email, password e.g., user_params = {'email':'aa@aa.com','password':'demo'}
    query = Query.create('local:user').set(user_params).select('email')
    results = execute_query(request,query)
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
    results = execute_query(request,query)
    if not results:
        raise Exception, "Failed creating manifold account on platform %s for user: %s" % (account_params['platform'], account_params['user'])
    result, = results
    return (result['user'], result['platform'])

def manifold_update_account(request,account_params):
    # account_params: config
    query = Query.update('local:account').filter_by('email', '==', request.user.email).set(account_params).select('email')
    results = execute_query(request,query)
    # NOTE: results remains empty and goes to Exception. However, it updates the manifold DB.
    # That's why I commented the exception part. -- Yasin 
    #if not results:
    #    raise Exception, "Failed updating manifold account: config %s" % account_params['config']
    #result, = results
    return results


def make_request_user(user):
    request = {}
    request['type'] = 'user'
    request['id'] = user.id
    request['timestamp'] = 'TODO' # XXX in DB ?
    request['authority_hrn'] = user.authority_hrn
    request['first_name'] = user.first_name
    request['last_name'] = user.last_name
    request['email'] = user.email
    return request

def make_request_slice(slice):
    request = {}
    request['type'] = 'slice'
    request['id'] = slice.id
    request['timestamp'] = 'TODO' # XXX in DB ?
    request['authority_hrn'] = slice.authority_hrn
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
    
SFA_USER_KEYS         = ['xrn', 'type', 'key', 'first_name', 'last_name', 'email']
SFA_SLICE_KEYS        = []
MANIFOLD_USER_KEYS    = ['email', 'password']
MANIFOLD_ACCOUNT_KEYS = []

def portal_validate_request(request_ids):
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

        if request['type'] == 'user':
            try:
                sfa_user_params = { key: request[key] for key in SFA_USER_KEYS }
                sfa_user_params['enabled'] = True
                # XXX # sfa_add_user(sfa_user_params)
                request_status['SFA user'] = {'status': True }
            except Exception, e:
                request_status['SFA user'] = {'status': False, 'description': str(e)}

            try:
                manifold_user_params = { key: request[key] for key in MANIFOLD_USER_KEYS }
                # XXX # manifold_add_user(manifold_user_params)
                request_status['MySlice user'] = {'status': True }
            except Exception, e:
                request_status['MySlice user'] = {'status': False, 'description': str(e)}

            # XXX
            #manifold_account_params = { key: request[key] for key in MANIFOLD_ACCOUNT_KEYS }
            #manifold_add_account(manifold_account_params)
            request_status['MySlice testbed accounts'] = {'status': False }

        elif request['type'] == 'slice':
            try:
                sfa_slice_params = { key: request[key] for key in SFA_SLICE_KEYS }
                # XXX # sfa_add_slice(sfa_slice_params)
                request_status['SFA slice'] = {'status': True }
            except Exception, e:
                request_status['SFA slice'] = {'status': False, 'description': str(e)}

        status['%s__%s' % (request['type'], request['id'])] = request_status

    # XXX remove from database succeeded actions

    return status


def validate_action(*args, **kwargs):
    ids = filter(None, kwargs['id'].split('/'))
    status = portal_validate_request(ids)
    json_answer = json.dumps(status)
    return HttpResponse (json_answer, mimetype="application/json")

# Django and ajax
# http://djangosnippets.org/snippets/942/
