from django.http                    import HttpResponse
from manifold.core.query            import Query
from manifoldapi.manifoldapi        import execute_query,execute_admin_query
from portal.models                  import PendingUser, PendingSlice, PendingAuthority, PendingProject, PendingJoin
from unfold.page                    import Page

import json

from django.contrib.auth.models     import User
from django.contrib.auth            import get_user_model
from django.template.loader         import render_to_string
from django.core.mail               import EmailMultiAlternatives, send_mail

from myslice.theme                  import ThemeView
from myslice.configengine           import ConfigEngine

from myslice.settings import logger

theme = ThemeView()

import activity.slice

# Thierry: moving this right into the code so 
# most people can use myslice without having to install sfa
# XXX tmp sfa dependency, should be moved to SFA gateway
#from sfa.util.xrn                import Xrn 

def get_myslice_platform(request):
    platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled','config').filter_by('platform','==','myslice')
    platform_details = execute_query(request, platform_query)
    if isinstance(platform_details,list):
        for platform_detail in platform_details:
            return platform_detail
    else:
        return None

def get_myslice_account(request):
    try:
        platform_myslice = get_myslice_platform(request)
        account_query  = Query().get('local:account').select('user_id','platform_id','auth_type','config').filter_by('platform_id','==',platform_myslice['platform_id'])
        account_details = execute_query(request, account_query)
        for account_detail in account_details:
            return account_detail
    except Exception as e:
        print e
        return None

def get_registry_url(request):
    try:
        platform_detail = get_myslice_platform(request)
        platform_config = json.loads(platform_detail['config'])
        import socket
        hostname = socket.gethostbyaddr(socket.gethostname())[0]
        registry = platform_config.get('registry','N/A')
        if 'localhost' in registry:
            port = registry.split(':')[-1:][0]
            registry = "http://" + hostname +':'+ port
        return registry
    except Exception as e:
        print e
        return None

def get_jfed_identity(request):
    try:
        account_detail = get_myslice_account(request)
        account_config = json.loads(account_detail['config'])
        if 'user_private_key' in account_config:
            private_key = account_config['user_private_key']
            user_hrn = account_config.get('user_hrn','N/A')
            platform_detail = get_myslice_platform(request)
            registry = get_registry_url(request)
            #registry = 'http://sfa-fed4fire.pl.sophia.inria.fr:12345/'
            jfed_identity = user_hrn + '\n' + registry + '\n' + private_key 
            return jfed_identity
        else:
            return None
    except Exception as e:
        print e
        return None

# Get the list of pis in a given authority
def authority_get_pis(request, authority_hrn):
    # CACHE PB with fields
    page = Page(request)
    metadata = page.get_metadata()
    auth_md = metadata.details_by_object('authority')
    auth_fields = [column['name'] for column in auth_md['column']]

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query = Query.get('myslice:authority').filter_by('authority_hrn', '==', authority_hrn).select(auth_fields)
    results = execute_admin_query(request, query)
    #print "authority_get_pis = %s" % results
    # NOTE: temporarily commented. Because results is giving empty list. 
    # Needs more debugging
    #if not results:
    #    raise Exception, "Authority not found: %s" % authority_hrn
    #result, = results
    #return result['pi_users']
    return results

#check the user is pi or not in the registry
def authority_check_pis(request, user_email):
    try:
        user_query  = Query().get('local:user').filter_by('email', '==', user_email).select('user_id','email','password','config')
        user_details = execute_admin_query(request, user_query)
    
        # getting the authority_hrn
        for user_detail in user_details:
            user_id = user_detail['user_id']
            if user_detail['config']:
                config = json.loads(user_detail['config'])
                authority_hrn = config.get('authority','Unknown Authority')
 
        account_query  = Query().get('local:account').filter_by('user_id', '==', user_id).select('user_id','platform_id','auth_type','config')
        account_details = execute_admin_query(request, account_query)
    
        platform_query  = Query().get('local:platform').select('platform_id','platform')
        platform_details = execute_admin_query(request, platform_query)
    
        for account_detail in account_details:
            for platform_detail in platform_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    if 'myslice' in platform_detail['platform']:
                        account_config = json.loads(account_detail['config'])
                        user_hrn = account_config.get('user_hrn','N/A')

        pi_status = False
        pis = authority_get_pis (request, authority_hrn)
        for pi in pis:
            pi_list = pi['pi_users']

        if user_hrn in pi_list:
            pi_status = True
        return pi_status

    except Exception as e:
        logger.error("Exception in actions.py in authority_check_pis {}".format(e))
        return None


def authority_add_pis(request, authority_hrn, user_hrn):
    try:
        pi_list = []
        # getting pis of the authority of the user
        pis = authority_get_pis (request, authority_hrn)
        for pi in pis:
            pi_list = pi['pi_users']
   
        updated_pi_list = pi_list.append(user_hrn) 
        query = Query.update('myslice:authority').filter_by('authority_hrn', '==', authority_hrn).set({'pi_users':pi_list})
        results = execute_query(request,query)
        newpis = authority_get_pis (request, authority_hrn)
       
        # Add the user to the slices of the project he/she joined
        if len(authority_hrn.split('.')) > 2:
            # this authority_hrn is a project
            query_slices = Query.get('myslice:slice').filter_by('parent_authority', '==', authority_hrn).select('slice_hrn')
            results_slices = execute_query(request,query_slices)
            for s in results_slices:
                sfa_add_user_to_slice(request, user_hrn, s['slice_hrn'])
        # Clear Credentials of the user 
        user_email = get_user_email(request, user_hrn)
        clear_user_creds(request, user_email)

        return newpis
    except Exception as e: 
        logger.error("Exception in actions.py in authority_add_pis {}".format(e))
        raise Exception, "Exception in actions.py in authority_add_pis {}".format(e)

def authority_remove_pis(request, authority_hrn, user_hrn):
    try:
        pi_list = []
        # getting pis of the authority of the user
        pis = authority_get_pis (request, authority_hrn)
        for pi in pis:
            pi_list = pi['pi_users']
 
        updated_pi_list = pi_list.remove(user_hrn) 
        query = Query.update('myslice:authority').filter_by('authority_hrn', '==', authority_hrn).set({'pi_users':pi_list})
        results = execute_query(request,query)
        newpis = authority_get_pis (request, authority_hrn)

        # Remove the user from the slices of the project he/she left
        if len(authority_hrn.split('.')) > 2:
            # this authority_hrn is a project
            query_slices = Query.get('myslice:slice').filter_by('parent_authority', '==', authority_hrn).select('slice_hrn')
            results_slices = execute_query(request,query_slices)
            for s in results_slices:
                print 'remove from slice %s' % s
                sfa_remove_user_from_slice(request, user_hrn, s['slice_hrn'])

        # Clear Credentials of the user 
        user_email = get_user_email(request, user_hrn)
        clear_user_creds(request, user_email)

        return newpis
    except Exception as e: 
        logger.error("Exception in actions.py in authority_remove_pis {}".format(e))
        raise Exception, "Exception in actions.py in authority_remove_pis {}".format(e)


def authority_get_pi_emails(request, authority_hrn):
    pi_users = authority_get_pis(request,authority_hrn)
    logger.info("pi_users = %s" % pi_users)

    if any(pi['pi_users'] == None or not pi['pi_users']  for pi in pi_users):
        #theme.template_name = 'email_default_recipients.txt' 
        #default_email = render_to_string(theme.template, request)
        #default_email = default_email.replace('\n', '')
        #return default_email
        # the above doesn't work
        return ['support@onelab.eu']
    else:
        pi_user_hrns = [ hrn for x in pi_users for hrn in x['pi_users'] ]

        # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
        query = Query.get('myslice:user').filter_by('user_hrn', 'included', pi_user_hrns).select('user_email')
        results = execute_admin_query(request, query)
        return [result['user_email'] for result in results]

def get_user_email(request, user_hrn):
    query = Query.get('myslice:user').filter_by('user_hrn', '==', user_hrn).select('user_email')
    results = execute_admin_query(request, query)
    return results[0]['user_email'] 

#clear user credentials
def clear_user_creds(request, user_email):
    try:
        user_query  = Query().get('local:user').filter_by('email', '==', user_email).select('user_id','email','password','config')
        user_details = execute_admin_query(request, user_query)
    
        # getting the user_id from the session
        for user_detail in user_details:
            user_id = user_detail['user_id']
            user_email = user_detail['email']
    
        account_query  = Query().get('local:account').filter_by('user_id', '==', user_id).select('user_id','platform_id','auth_type','config')
        account_details = execute_admin_query(request, account_query)
    
        platform_query  = Query().get('local:platform').select('platform_id','platform')
        platform_details = execute_admin_query(request, platform_query)
    
        for account_detail in account_details:
            for platform_detail in platform_details:
                if platform_detail['platform_id'] == account_detail['platform_id']:
                    if 'myslice' in platform_detail['platform']:
                        account_config = json.loads(account_detail['config'])
                        #user_cred = account_config.get('delegated_user_credential','N/A')
                        user_cred = account_config.get('user_credential','N/A')
                        if 'N/A' not in user_cred:
                            user_hrn = account_config.get('user_hrn','N/A')
                            user_pub_key = json.dumps(account_config.get('user_public_key','N/A'))
                            user_priv_key = json.dumps(account_config.get('user_private_key','N/A'))
                            updated_config = '{"user_public_key":'+ user_pub_key + ', "user_private_key":'+ user_priv_key + ', "user_hrn":"'+ user_hrn + '"}'
                            user_params = { 'config': updated_config}
                            manifold_update_account(request, user_id,user_params)
                            return user_email
                        else:
                            return None

    except Exception as e:
        logger.error("Exception in actions.py in clear_user_creds {}".format(e))
        return None

def is_pi(wsgi_request, user_hrn, authority_hrn):
    # authorities from user where user_hrn == "ple.upmc.jordan_auge"
    logger.debug("#### actions.py is_pi authority_hrn = {}".format(authority_hrn))
    try:
        # CACHE PB with fields
        page = Page(wsgi_request)
        metadata = page.get_metadata()
        user_md = metadata.details_by_object('user')
        user_fields = [column['name'] for column in user_md['column']]
        
        # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
        query  = Query().get('myslice:user').select(user_fields).filter_by('user_hrn','==',user_hrn)
        #query = Query.get('myslice:user').filter_by('user_hrn', '==', user_hrn).select('pi_authorities')
        results = execute_query(wsgi_request, query)
        for user_detail in results:
            if authority_hrn in user_detail['pi_authorities']:
                return True
    except Exception as e:
        logger.error("Exception in actions.py in is_pi {}".format(e))
    return False
    
# SFA get record

def sfa_get_user(request, user_hrn, pub=None):

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query_sfa_user = Query.get('myslice:user').filter_by('user_hrn', '==', user_hrn)
    result_sfa_user = execute_admin_query(request, query_sfa_user)
    return result_sfa_user[0]                        

def sfa_update_user(request, user_hrn, user_params):
    # user_params: keys [public_key] 
    if 'email' in user_params:
        user_params['user_email'] = user_params['email']

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query = Query.update('myslice:user').filter_by('user_hrn', '==', user_hrn).set(user_params).select('user_hrn')
    results = execute_admin_query(request,query)
    return results

def sfa_add_authority(request, authority_params):

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query = Query.create('myslice:authority').set(authority_params).select('authority_hrn')
    results = execute_query(request, query)
    logger.info("sfa_add_auth results={}".format(results))
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % authority_params['hrn']
    return results

def sfa_add_user_to_slice(request, user_hrn, slice_hrn):
# UPDATE myslice:slice SET users = ['fed4fire.upmc.loic_baron', 'fed4fire.upmc.mohammed-yasin_rahman', 'fed4fire.upmc.demo'] WHERE slice_hrn == 'fed4fire.upmc.project_y.test_under' SELECT slice_hrn, slice_urn
    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query_current_users = Query.get('myslice:slice').select('users').filter_by('slice_hrn','==',slice_hrn)
    results_current_users = execute_query(request, query_current_users)
    current_users = list()
    for r in results_current_users:
        current_users.extend(r['users'])
    users = list(set([user_hrn]) | set(current_users))

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query = Query.update('myslice:slice').filter_by('slice_hrn', '==', slice_hrn).set({'users':users}).select('slice_hrn')
    results = execute_query(request, query)
# Also possible but not supported yet
# UPDATE myslice:user SET slice=['ple.upmc.agent','ple.upmc.myslicedemo','ple.upmc.tophat'] where user_hrn=='ple.upmc.azerty'
    if not results:
        raise Exception, "Could not add user %s to slice %s" % (user_hrn, slice_hrn)
    return results

def sfa_remove_user_from_slice(request, user_hrn, slice_hrn):
# UPDATE myslice:slice SET users = ['fed4fire.upmc.loic_baron', 'fed4fire.upmc.demo'] WHERE slice_hrn == 'fed4fire.upmc.project_y.test_under' SELECT slice_hrn, slice_urn
    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query_current_users = Query.get('myslice:slice').select('users').filter_by('slice_hrn','==',slice_hrn)
    results_current_users = execute_query(request, query_current_users)
    current_users = list()
    for r in results_current_users:
        current_users.extend(r['users'])
    if user_hrn in current_users:
        current_users.remove(user_hrn)

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query = Query.update('myslice:slice').filter_by('slice_hrn', '==', slice_hrn).set({'users':current_users}).select('slice_hrn')
    results = execute_query(request, query)
# Also possible but not supported yet
# UPDATE myslice:user SET slice=['ple.upmc.agent','ple.upmc.myslicedemo','ple.upmc.tophat'] where user_hrn=='ple.upmc.azerty'
    if not results:
        raise Exception, "Could not remove user %s to slice %s" % (user_hrn, slice_hrn)
    return results

# Propose hrn

def manifold_add_user(wsgi_request, request):
    """Add a Manifold user corresponding to a user request.

    Args:
        wsgi_request: a WSGIRequest instance
        request (dict): a dictionary containing the user request built from the
            form.

    Returns:
        The user_id of the inserted user.

    Raises:
        ?
    
    """
    USER_CONFIG = '{"firstname": "%(first_name)s", "lastname": "%(last_name)s", "authority": "%(authority_hrn)s"}'

    user_params = {
        'email'     : request['email'],
        'password'  : request['password'],
        'config'    : USER_CONFIG % request,
        'status'    : 1,
    }

    query = Query.create('local:user').set(user_params).select('email')
    results = execute_admin_query(request, query)
    if not results:
        raise Exception, "Failed creating manifold user: %s" % user_params['email']
    result = results[0]
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
def manifold_delete_account(request, user_id, platform_id = None):
    query = Query.delete('local:account').filter_by('user_id', '==', user_id)
    if platform_id is not None:
        query.filter_by('platform_id', '==', platform_id)
    results = execute_admin_query(request,query)
    return results

def manifold_delete_user(request, user_id):
    query = Query.delete('local:user').filter_by('user_id', '==', user_id).select('user_id')
    results = execute_admin_query(request,query)
    return results


#not tested
def manifold_add_platform(request, platform_params):
    query = Query.create('local:platform').set(platform_params).select(['user', 'platform'])
    results = execute_admin_query(request,query)
    if not results:
        raise Exception, "Failed creating manifold platform %s for user: %s" % (platform_params['platform'], platform_params['user'])
    result, = results
    return result['platform_id']

def delete_local_user(wsgi_request, user_email):
    user_query = Query().get('local:user') \
        .filter_by('email', '==', user_email)           \
        .select('user_id','config')
    user = execute_admin_query(wsgi_request, user_query)
    if len(user) == 0:
        return False
        #raise Exception, "User not found, check local DB"
    else:
        user_id = user[0]['user_id']
        user_config = json.loads(user[0]['config'])
        authority_hrn = user_config.get('authority', None)
        
        if is_pi(wsgi_request, '$user_hrn', authority_hrn):
            # removing from Django auth_user
            UserModel = get_user_model()
            UserModel._default_manager.filter(email__iexact = user_email).delete()

            # removing manifold account
            manifold_delete_account(wsgi_request, user_id)           
                     
            # removing manifold user
            manifold_delete_user(wsgi_request, user_id)
        else:
            return False
            #raise Exception, "No sufficient rights on authority = ",authority_hrn

    return True      


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
    request['user_hrn']      = user.user_hrn
    request['public_key']    = user.public_key
    request['private_key']   = user.private_key
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

def make_request_project(project):
    request = {}
    request['type'] = 'project'
    request['id'] = project.id
    request['user_hrn'] = project.user_hrn
    request['email'] = project.email
    request['timestamp'] = project.created
    request['authority_hrn'] = project.authority_hrn
    request['project_name'] = project.project_name
    request['purpose'] = project.purpose
    return request

def make_request_join(join):
    request = {}
    request['type'] = 'join'
    request['id'] = join.id
    request['user_hrn'] = join.user_hrn
    request['email'] = join.email
    request['timestamp'] = join.created
    request['authority_hrn'] = join.authority_hrn
    request['project_name'] = join.project_name
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

def make_requests(pending_users, pending_slices, pending_authorities, pending_projects, pending_joins):
    logger.info("$$$$$$$$$$$$$$$  make_request")
    requests = []
    for user in pending_users:
        requests.append(make_request_user(user))
    for slice in pending_slices:
        requests.append(make_request_slice(slice))
    for authority in pending_authorities:
        requests.append(make_request_authority(authority))
    for project in pending_projects:
        requests.append(make_request_project(project))
    for join in pending_joins:
        requests.append(make_request_join(join))
    return requests   

def get_request_by_id(ids):
    logger.info("$$$$$$$$$$$$$$$$  get_request_by_id")
    sorted_ids = { 'user': [], 'slice': [], 'authority': [], 'project': [], 'join': [] }
    for type__id in ids:
        type, id = type__id.split('__')
        sorted_ids[type].append(id)
        
    if not ids:
        pending_users  = PendingUser.objects.all()
        pending_slices = PendingSlice.objects.all()
        pending_authorities = PendingAuthority.objects.all()
        pending_projects = PendingProject.objects.all()
        pending_joins = PendingJoin.objects.all()
    else:
        pending_users  = PendingUser.objects.filter(id__in=sorted_ids['user']).all()
        pending_slices = PendingSlice.objects.filter(id__in=sorted_ids['slice']).all()
        pending_authorities = PendingAuthority.objects.filter(id__in=sorted_ids['authority']).all()
        pending_projects = PendingProject.objects.filter(id__in=sorted_ids['project']).all()
        pending_joins = PendingJoin.objects.filter(id__in=sorted_ids['join']).all()

    return make_requests(pending_users, pending_slices, pending_authorities, pending_projects, pending_joins)

def get_requests(authority_hrns=None):
    logger.info("$$$$$$$$$$$$$   get_request_by_authority auth_hrns = {}".format(authority_hrns))
    if not authority_hrns:
        ## get those pending users who have confirmed their emails
        pending_users  = PendingUser.objects.filter(status__iexact = 'True')
        pending_slices = PendingSlice.objects.all()
        pending_authorities = PendingAuthority.objects.all()
        pending_projects = PendingProject.objects.all()
        pending_joins = PendingJoin.objects.all()
    else:
        pending_users  = PendingUser.objects
        pending_slices = PendingSlice.objects
        pending_authorities = PendingAuthority.objects
        pending_projects = PendingProject.objects
        pending_joins = PendingJoin.objects
        from django.db.models import Q
        list_user_Q = list()
        list_slice_Q = list()
        list_auth_Q = list()
        list_proj_Q = list()
        list_join_Q = list()
        for hrn in authority_hrns:
            list_user_Q.append(Q(authority_hrn__startswith=hrn, status__iexact = 'True'))
            list_slice_Q.append(Q(authority_hrn__startswith=hrn))
            list_auth_Q.append(Q(site_authority__startswith=hrn))
            list_proj_Q.append(Q(authority_hrn__startswith=hrn))
            list_join_Q.append(Q(authority_hrn__startswith=hrn))
        from operator import __or__ as OR
        pending_users        = pending_users.filter(reduce(OR, list_user_Q))
        pending_slices       = pending_slices.filter(reduce(OR, list_slice_Q))
        pending_authorities  = pending_authorities.filter(reduce(OR, list_auth_Q))
        pending_projects     = pending_projects.filter(reduce(OR, list_proj_Q))
        pending_joins        = pending_joins.filter(reduce(OR, list_join_Q))
        #pending_authorities  = pending_authorities.all() #filter(reduce(OR, list_Q))

    return make_requests(pending_users, pending_slices, pending_authorities, pending_projects, pending_joins)

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
        try:
            if request['type'] == 'user':
                create_user(wsgi_request, request)
                request_status['SFA user'] = {'status': True }
                u = PendingUser.objects.get(id=request['id'])
                ctx = {
                    'first_name'    : u.first_name, 
                    'last_name'     : u.last_name,
                    'email'         : u.email,        
                }      
                user_email = u.email

                PendingUser.objects.get(id=request['id']).delete()

            elif request['type'] == 'slice':
                create_slice(wsgi_request, request)
                request_status['SFA slice'] = {'status': True }
                s = PendingSlice.objects.get(id=request['id'])
                ctx = {
                    'slice_name'    : s.slice_name, 
                    'url'           : s.url,
                    'purpose'       : s.purpose,        
                    'email'         : s.email,        
                }      
                user_email = s.email

                PendingSlice.objects.get(id=request['id']).delete()

                # Clear user's Credentials
                sfa_user = sfa_get_user(wsgi_request, request['user_hrn'])
                clear_user_creds(wsgi_request,sfa_user['user_email'])

            elif request['type'] == 'authority':
                #hrn = "%s.%s" % (request['authority_hrn'], request['site_authority'])
                hrn = request['site_authority']
                # XXX tmp sfa dependency
                from sfa.util.xrn import Xrn 
                urn = Xrn(hrn, request['type']).get_urn()
                
                # Only hrn is required for Manifold Query 
                sfa_authority_params = {
                    'authority_hrn'        : hrn,
                    #'authority_urn'        : urn,
                    #'type'       : request['type'],
                    #'pi'        : None,
                    #'enabled'    : True
                }
                logger.info("ADD Authority")
                sfa_add_authority(wsgi_request, sfa_authority_params)
                request_status['SFA authority'] = {'status': True }
                a = PendingAuthority.objects.get(id=request['id'])
                ctx = { 
                    'site_name'     : a.site_name,
                    #'short_name'    : a.short_name,
                    #'url'           : a.url,
                    'city'          : a.address_city,
                    'country'       : a.address_country,                          
                    #'portal_url'    : a.current_site,
                }
                # address_line1 contains the email of the user in pending_authority table
                user_email = a.address_line1

                PendingAuthority.objects.get(id=request['id']).delete()
                
                # Clear Admin Cache as it is used to display the list of authorities in Registration page
                query = Query.update('myslice:authority').filter_by('authority_hrn', '==', sfa_authority_params['authority_hrn']).set({'authority_hrn':sfa_authority_params['authority_hrn']}).select('authority_hrn')
                res = execute_admin_query(request, query)

            elif request['type'] == 'project':
                hrn = request['authority_hrn'] + '.' + request['project_name']

                # Only hrn is required for Manifold Query 
                sfa_authority_params = {
                    'authority_hrn'        : hrn
                }
                sfa_add_authority(wsgi_request, sfa_authority_params)
                
                # Add user as a PI of the project
                # Clear user's Credentials
                authority_add_pis(wsgi_request, hrn , request['user_hrn'])

                request_status['SFA project'] = {'status': True }
                p = PendingProject.objects.get(id=request['id'])
                ctx = {
                    'project_name'  : p.project_name, 
                    'authority_hrn' : p.authority_hrn,
                    'email'         : p.email,        
                    'purpose'       : p.purpose,
                }      
                user_email = p.email

                PendingProject.objects.get(id=request['id']).delete()

                # Clear Admin Cache as it is used to display the list of projects in Slice request page
                query = Query.update('myslice:authority').filter_by('authority_hrn', '==', sfa_authority_params['authority_hrn']).set({'authority_hrn':sfa_authority_params['authority_hrn']}).select('authority_hrn')
                res = execute_admin_query(request, query)


            elif request['type'] == 'join':
                # Add user as a PI of the project
                # Clear user's Credentials
                authority_add_pis(wsgi_request, request['authority_hrn'] , request['user_hrn'])

                request_status['SFA join'] = {'status': True }
                j = PendingJoin.objects.get(id=request['id'])
                ctx = {
                    'project_name'  : j.project_name, 
                    'authority_hrn' : j.authority_hrn,
                    'email'         : j.email,        
                    'user_hrn'      : j.user_hrn,
                }      
                user_email = j.email

                PendingJoin.objects.get(id=request['id']).delete()
            else:
                raise Exception, 'unknown type of request %s' % request['type']
            # XXX Remove from Pendings in database

            send_status_email(wsgi_request, ctx, user_email, request['type'], 'validated')
        except Exception, e:
            request_status['SFA '+request['type']] = {'status': False, 'description': str(e)}
            logger.error('ERROR - actions.py - portal_validate_request: %s' % e)
            import traceback
            logger.error(traceback.format_exc())

        status['%s__%s' % (request['type'], request['id'])] = request_status

    return status

def validate_action(request, **kwargs):
    ids = filter(None, kwargs['id'].split('/'))
    status = portal_validate_request(request, ids)
    json_answer = json.dumps(status)
    return HttpResponse (json_answer, content_type="application/json")


def reject_action(request, **kwargs):
    ids = filter(None, kwargs['id'].split('/'))
    status = portal_reject_request(request, ids)
    json_answer = json.dumps(status)
    return HttpResponse (json_answer, content_type="application/json")

def get_current_site(request):
    if request.is_secure():
        current_site = 'https://'
    else:
        current_site = 'http://'
    current_site += request.META['HTTP_HOST']
    return current_site

def portal_reject_request(wsgi_request, request_ids):
    status = {}
    current_site = get_current_site(wsgi_request)
    if not isinstance(request_ids, list):
        request_ids = [request_ids]

    requests = get_request_by_id(request_ids)
    for request in requests:
        # type, id, timestamp, details, allowed -- MISSING: authority_hrn
        # CAREFUL about details
        # user  : first name, last name, email, password, keypair
        # slice : number of nodes, type of nodes, purpose
        
        request_status = {}

        try:
            if request['type'] == 'user':
                request_status['SFA user'] = {'status': True }
                # getting user email based on id 
                ## RAW SQL queries on Django DB- https://docs.djangoproject.com/en/dev/topics/db/sql/
                for user in PendingUser.objects.raw('SELECT * FROM portal_pendinguser WHERE id = %s', [request['id']]):
                    user_email= user.email
                    first_name = user.first_name
                    last_name = user.last_name

                ctx = {
                    'first_name'    : first_name, 
                    'last_name'     : last_name, 
                    'email'         : user_email,
                    'portal_url'    : current_site,
                    }

                # removing from Django portal_pendinguser
                PendingUser.objects.get(id=request['id']).delete()
                
                delete_local_user(wsgi_request, user_email)
                          
            elif request['type'] == 'slice':
                request_status['SFA slice'] = {'status': True } 

                # getting user email based on id 
                ## RAW SQL queries on Django DB- https://docs.djangoproject.com/en/dev/topics/db/sql/
                for user in PendingSlice.objects.raw('SELECT * FROM portal_pendingslice WHERE id = %s', [request['id']]):
                    user_email= user.type_of_nodes # XXX type_of_nodes field contains the email [shd be renamed in DB]
                    slice_name = user.slice_name
                    purpose = user.purpose
                    url = user.number_of_nodes

                ctx = {
                    'slice_name': slice_name,
                    'purpose': purpose,
                    'url': url,
                    'portal_url': current_site,
                    }

                PendingSlice.objects.get(id=request['id']).delete()

            elif request['type'] == 'authority':
                request_status['SFA authority'] = {'status': True }
                
                # getting user email based on id 
                ## RAW SQL queries on Django DB- https://docs.djangoproject.com/en/dev/topics/db/sql/
                for user in PendingAuthority.objects.raw('SELECT * FROM portal_pendingauthority WHERE id = %s', [request['id']]):
                    user_email= user.address_line1 # XXX address_line1 field contains the email [shd be renamed in DB]
                    site_name = user.site_name
                    city = user.address_city
                    country = user.address_country
                    short_name = user.site_abbreviated_name
                    url = user.site_url

                ctx = { 
                    'site_name': site_name,
                    'short_name': short_name,
                    'url': url,
                    'city': city,
                    'country': country,                          
                    'portal_url'    : current_site,
                    }
                    
                PendingAuthority.objects.get(id=request['id']).delete()

            # XXX TMP we should send an email to the user to inform him/her
            elif request['type'] == 'project':
                request_status['SFA project'] = {'status': True }
                p = PendingProject.objects.get(id=request['id'])
                ctx = {
                    'project_name'  : p.project_name, 
                    'authority_hrn' : p.authority_hrn,
                    'email'         : p.email,        
                    'purpose'       : p.purpose,
                }      
                user_email = p.email
                PendingProject.objects.get(id=request['id']).delete()

            elif request['type'] == 'join':
                request_status['SFA join'] = {'status': True }
                j = PendingJoin.objects.get(id=request['id'])
                ctx = {
                    'project_name'  : j.project_name, 
                    'authority_hrn' : j.authority_hrn,
                    'email'         : j.email,        
                    'user_hrn'      : j.user_hrn,
                }      

                user_email = j.email
                PendingJoin.objects.get(id=request['id']).delete()
            else:
                raise Exception, 'unknown type of request %s' % request['type']

            send_status_email(wsgi_request, ctx, user_email, request['type'], 'denied')
        except Exception, e:
            request_status['SFA '+request['type']] = {'status': False, 'description': str(e)}
            logger.error('ERROR - actions.py - portal_reject_request: %s' % e)
            import traceback
            logger.error(traceback.format_exc())

        status['%s__%s' % (request['type'], request['id'])] = request_status

    return status

def send_status_email(request, ctx, user_email, obj_type, status):
    try:
        ctx['current_site'] = get_current_site(request)
        ctx['theme'] = theme

        theme.template_name = obj_type + '_request_' + status + '.txt'
        text_content = render_to_string(theme.template, ctx)
        theme.template_name = obj_type + '_request_' + status + '.html'
        html_content = render_to_string(theme.template, ctx)
        theme.template_name = 'email_default_sender.txt'

        sender =  render_to_string(theme.template, ctx)
        sender = sender.replace('\n', '')
                       
        subject = obj_type.title() + ' request '+ status
    
        msg = EmailMultiAlternatives(subject, text_content, sender, [user_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except Exception as e:
        print e
        logger.error("Failed to send email, please check the mail templates and the SMTP configuration of your server")


# Django and ajax
# http://djangosnippets.org/snippets/942/



#-------------------------------------------------------------------------------
# REQUESTS - Slices
#-------------------------------------------------------------------------------

def create_slice(wsgi_request, request):
    """
    Arguments:
        wsgi_request (~ WSGIRequest) : 
        request (dict) : the slice request in our own dict format

    Raises:
        Exception
    """
    hrn = "%s.%s" % (request['authority_hrn'], request['slice_name'])
    # XXX tmp sfa dependency
    from sfa.util.xrn import Xrn 
    urn = Xrn(hrn, request['type']).get_urn()
    
    # Add User to Slice if we have the user_hrn in pendingslice table
    user_hrn = request.get('user_hrn', None)
    user_hrns = list([user_hrn]) if user_hrn else list()
   
    # CACHE PB with fields
    page = Page(wsgi_request)
    metadata = page.get_metadata()
    user_md = metadata.details_by_object('user')
    user_fields = [column['name'] for column in user_md['column']]

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    #user_query  = Query().get('myslice:user').select('user_hrn','user_email').filter_by('user_hrn','==',user_hrn)
    user_query  = Query().get('myslice:user').select(user_fields).filter_by('user_hrn','==',user_hrn)
    user_details_sfa = execute_admin_query(wsgi_request, user_query)
    if not user_details_sfa:
        raise Exception, "User %s doesn't exist, validate user before validating slice" % user_hrn
    for user in user_details_sfa:
        user_email = user['user_email']

    # XXX LOIC Quick fix because this is totally inconsistent
    if not 'number_of_nodes' in request:
        request['number_of_nodes']=""

    # Slice is under a project
    if len(request['authority_hrn'].split('.')) > 2:
        pi_list = []
        pis = authority_get_pis(wsgi_request, request['authority_hrn'])
        for pi in pis:
            pi_list = pi['pi_users']
        user_hrns.extend(pi_list)

    # XXX We should create a slice with Manifold terminology
    slice_params = {
        'slice_hrn'        : hrn, 
        'slice_urn'        : urn,
        'slice_type'       : request['type'],
        'url'              : request['number_of_nodes'],
        'users'            : user_hrns,
        'slice_enabled'    : True
    }
    # ignored in request: id, timestamp,  number_of_nodes, type_of_nodes, purpose

    # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
    query = Query.create('myslice:slice').set(slice_params).select('slice_hrn')
    results = execute_query(wsgi_request, query)
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % slice_params['hrn']
    else:
        try:
            for u_hrn in user_hrns:
                u_email = get_user_email(wsgi_request, u_hrn)
                clear_user_creds(wsgi_request, u_email)
        except Exception as e:
            logger.error("Failed clear credentials for all users")
            clear_user_creds(wsgi_request,user_email)
        # log user activity
        activity.slice.validate(request, { "slice" : hrn })
       
    return results

def create_pending_slice(wsgi_request, request, email):
    """
    """

    # Insert an entry in the PendingSlice table
    s = PendingSlice(
        slice_name      = request['slice_name'],
        user_hrn        = request['user_hrn'],
        authority_hrn   = request['authority_hrn'],
        number_of_nodes = request['url'], # field needs to be renamed
        purpose         = request['purpose'],
        type_of_nodes   = request['email'] # field needs to be renamed 
    )
    s.save()

    send_email_to_pis(wsgi_request, request, 'slice')

def create_pending_project(wsgi_request, request):
    """
    """

    # Insert an entry in the PendingProject table
    s = PendingProject(
        project_name    = request['project_name'],
        user_hrn        = request['user_hrn'],
        email           = request['email'],
        authority_hrn   = request['authority_hrn'],
        purpose         = request['purpose'],
    )
    s.save()

    send_email_to_pis(wsgi_request, request, 'project')

def create_pending_join(wsgi_request, request):
    """
    """

    # Insert an entry in the PendingJoin table
    s = PendingJoin(
        user_hrn        = request['user_hrn'],
        email           = request['email'],
        project_name    = request['project_name'],
        authority_hrn   = request['authority_hrn'],
    )
    s.save()

    send_email_to_pis(wsgi_request, request, 'join')

#-------------------------------------------------------------------------------
# SEND EMAILS
#-------------------------------------------------------------------------------

def send_email_to_pis(request, context, obj_type):
    try:
        context['current_site'] = get_current_site(request)
        context['theme'] = theme
        # Send an email: the recipients are the PIs of the authority
        recipients = authority_get_pi_emails(request, context['authority_hrn'])

        theme.template_name = obj_type + '_request_email.txt' 
        text_content = render_to_string(theme.template, context)

        theme.template_name = obj_type + '_request_email.html' 
        html_content = render_to_string(theme.template, context)

        #theme.template_name = obj_type + '_request_email_subject.txt'
        #subject = render_to_string(theme.template, request)
        #subject = subject.replace('\n', '')
        subject = "New "+obj_type+" request"

        theme.template_name = 'email_default_sender.txt'
        sender =  render_to_string(theme.template, context)
        sender = sender.replace('\n', '')

        msg = EmailMultiAlternatives(subject, text_content, sender, recipients)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except Exception, e:
        print e
        print "Failed to send email, please check the mail templates and the SMTP configuration of your server"


#-------------------------------------------------------------------------------
# REQUESTS - Users
#-------------------------------------------------------------------------------

def manifold_add_reference_user_accounts(wsgi_request, request):
    """When a new user is created, add reference accounts to the reference platform.
    """
    # XXX XXX XXX The rest of this function has to be checked XXX XXX XXX

    # Retrieve user information
    user_query  = Query().get('local:user')             \
        .select('user_id', 'config', 'email', 'status') \
        .filter_by('email', '==', request['email'])
    user_details = execute_admin_query(wsgi_request, user_query)

    # USER MAIN ACCOUNT != reference
    #print 'USER MAIN ACCOUNT != reference'
    list_accounts_query = Query().get('local:account')              \
        .select('user_id', 'platform_id', 'auth_type', 'config')    \
        .filter_by('user_id', '==', user_details[0]['user_id'])     \
        .filter_by('auth_type', '!=', 'reference')
    list_accounts = execute_admin_query(wsgi_request, list_accounts_query)

    # XXX main_platform is being erased several times ???
    for account in list_accounts:
        main_platform_query = Query().get('local:platform')         \
            .select('platform_id', 'platform')                      \
            .filter_by('platform_id', '==', account['platform_id'])
        main_platform = execute_admin_query(wsgi_request, main_platform_query)

    # Add reference accounts on SFA enabled platforms
    platforms_query = Query().get('local:platform') \
        .filter_by('disabled', '==', '0')           \
        .filter_by('gateway_type', '==', 'sfa')     \
        .select('platform_id', 'gateway_type')
    platforms = execute_admin_query(wsgi_request, platforms_query)
    for platform in platforms:
        #print "add reference to platform ",platform
        manifold_account_params = {
            'user_id'       : user_details[0]['user_id'],
            'platform_id'   : platform['platform_id'],
            'auth_type'     : 'reference',
            'config'        : '{"reference_platform": "' + main_platform[0]['platform'] + '"}',
        }
        manifold_add_account(wsgi_request, manifold_account_params)

def sfa_create_user(wsgi_request, request, namespace = None, as_admin = False):
    """
    Arguments:
        wsgi_request (~ WSGIRequest) : 
        request (dict) : the user request in our own dict format

    Raises:
        Exception
    """
    from sfa.util.xrn import Xrn 

    auth_pi = request.get('pi', None)
    auth_pi = list([auth_pi]) if auth_pi else list()

    # We create a user request with Manifold terminology
    sfa_user_params = {
        'user_hrn'          : request['user_hrn'],
        'user_email'        : request['email'],
        'user_urn'          : Xrn(request['user_hrn'], request['type']).get_urn(),
        'user_type'         : request['type'],
        'keys'              : request['public_key'],
        'user_first_name'   : request['first_name'],
        'user_last_name'    : request['last_name'],
        'pi_authorities'    : auth_pi,
        'user_enabled'      : True
    }

    if namespace is not None:
        query = Query.create('%s:user' % namespace).set(sfa_user_params).select('user_hrn')
    else:
        # REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
        query = Query.create('myslice:user').set(sfa_user_params).select('user_hrn')

    if as_admin:
        results = execute_admin_query(wsgi_request, query)
    else:
        results = execute_query(wsgi_request, query)

    if not results:
        raise Exception, "Could not create %s. Already exists ?" % sfa_user_params['user_hrn']

    return results

def iotlab_create_user (wsgi_request, request, namespace = None, as_admin=False):
   
    import requests
    import time
    from requests.auth import HTTPBasicAuth
   
    engine = ConfigEngine() 
    URL_REST = engine.iotlab_url()
    LOGIN_ADMIN = engine.iotlab_admin_user()
    PASSWORD_ADMIN = engine.iotlab_admin_password()

    auth = HTTPBasicAuth(LOGIN_ADMIN,PASSWORD_ADMIN)
    headers = {'content-type': 'application/json'}

    for user in PendingUser.objects.raw('SELECT * FROM portal_pendinguser WHERE email = %s', [request['email']]):
        password= user.password


    iotlab_user_params = {
        "type"          : "SA",
        #"login"         : request['email'], #auto generated by iotlab
        "password"      : password,
        "firstName"     : request['first_name'],
        "lastName"      : request['last_name'],
        "email"         : request['email'],
        "structure"     : request['authority_hrn'],
        "city"          : "N/A",
        "country"       : "N/A",
        "sshPublicKey"  : request['public_key'],
        "motivations"   : "SFA federation",
    }    
   
    iotlab_user_params1 = json.dumps(iotlab_user_params)
    r=requests.post(url=URL_REST, data=iotlab_user_params1, headers=headers, auth=auth)
    logger.info('Create iotlab user : {} {}'.format(r.status_code, r.text))
    return r.text

def create_user(wsgi_request, request, namespace = None, as_admin = False):
    # XXX This has to be stored centrally
    USER_STATUS_ENABLED = 2

    # NOTE : if we were to create a user directly (just like we create slices,
    # we would have to perform the steps in create_pending_user too

    # Add the user to the SFA registry
    sfa_create_user(wsgi_request, request, namespace, as_admin)

    # Update Manifold user status
    manifold_update_user(wsgi_request, request['email'], {'status': USER_STATUS_ENABLED})

    # Add reference accounts for platforms
    manifold_add_reference_user_accounts(wsgi_request, request)

    # Add the user to iotlab portal if theme is set to onelab
    if theme.theme == 'onelab':
        iotlab_create_user (wsgi_request, request)

def create_pending_user(wsgi_request, request, user_detail):
    """
    """

    # Insert an entry in the PendingUser table
    b = PendingUser(
        first_name    = request['first_name'],
        last_name     = request['last_name'],
        authority_hrn = request['authority_hrn'],
        email         = request['email'],
        password      = request['password'],
        public_key    = request['public_key'],
        private_key   = request['private_key'],
        user_hrn      = request['user_hrn'],
        pi            = request['pi'],
        email_hash    = request['email_hash'],
        status        = 'False',
    )
    b.save()
    # sends email to user to activate the email
    request['current_site'] = get_current_site(wsgi_request)
    request['theme'] = theme
    theme.template_name = 'activate_user.html'
    html_content = render_to_string(theme.template, request)
    theme.template_name = 'activate_user.txt'
    text_content = render_to_string(theme.template, request)
    theme.template_name = 'activate_user_email_subject.txt'
    subject = render_to_string(theme.template, request)
    subject = subject.replace('\n', '')
    theme.template_name = 'email_default_sender.txt'
    sender =  render_to_string(theme.template, request)
    sender = sender.replace('\n', '')
    recipient = [request['email']]
    #recipient = recipient.append(request['email'])

    msg = EmailMultiAlternatives(subject, text_content, sender, recipient)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
   
    # saves the user to django auth_user table [needed for password reset]
    user = User.objects.create_user(request['email'], request['email'], request['password'])

    # Creating a manifold user
    user_id = manifold_add_user(wsgi_request, request)

    # Creating a Manifold account on the MySlice platform
    # Note the JSON representation of public and private keys already includes quotes
    account_config = {
        'user_hrn'          : request['user_hrn'],
        'user_public_key'   : request['public_key'],
    }
    if request['private_key']:
        account_config['user_private_key'] = request['private_key']

    user_id = user_detail['user_id'] + 1 # the user_id for the newly created user in local:user

    # XXX TODO: Require a myslice platform
    # ALERT: this will disapear with ROUTERV2 of Manifold
    # We have to consider the case where several registries can be used
    # Removed hardcoded platform = 5
    # This platform == 'myslice' is a TMP FIX !!
    try:
        reg_platform_query = Query().get('local:platform') \
            .filter_by('platform', '==', 'myslice')           \
            .select('platform_id')
        reg_platform = execute_admin_query(wsgi_request, reg_platform_query)

        reg_platform_id = reg_platform[0]['platform_id']
        account_params = {
            'platform_id'   : reg_platform_id, # XXX ALERT !!
            'user_id'       : user_id, 
            'auth_type'     : request['auth_type'], 
            'config'        : json.dumps(account_config),
        }
        manifold_add_account(wsgi_request, account_params)

    # Email to PIs is sent when the user activates his email
    # portal/emailactivationview.py

    except Exception as e:
        logger.error("Failed creating manifold account on platform {} for user: {}".format('myslice', request['email']))

