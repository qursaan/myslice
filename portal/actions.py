from django.http                import HttpResponse
from manifold.core.query        import Query
from manifoldapi.manifoldapi    import execute_query,execute_admin_query
from portal.models              import PendingUser, PendingSlice, PendingAuthority
import json

from django.contrib.auth.models import User
from django.template.loader     import render_to_string
from django.core.mail           import EmailMultiAlternatives, send_mail

from myslice.theme              import ThemeView

theme = ThemeView()

# Thierry: moving this right into the code so 
# most people can use myslice without having to install sfa
# XXX tmp sfa dependency, should be moved to SFA gateway
#from sfa.util.xrn                import Xrn 


# Get the list of authorities

def authority_get_pis(request, authority_hrn):
    query = Query.get('authority').filter_by('authority_hrn', '==', authority_hrn).select('pi_users')
    results = execute_admin_query(request, query)
    print "authority_get_pis = %s" % results
    # NOTE: temporarily commented. Because results is giving empty list. 
    # Needs more debugging
    #if not results:
    #    raise Exception, "Authority not found: %s" % authority_hrn
    #result, = results
    #return result['pi_users']
    return results

def authority_get_pi_emails(request, authority_hrn):
    pi_users = authority_get_pis(request,authority_hrn)
    print "pi_users = %s" % pi_users

    if any(d['pi_users'] == None for d in pi_users):
        #theme.template_name = 'email_default_recipients.txt' 
        #default_email = render_to_string(theme.template, request)
        #default_email = default_email.replace('\n', '')
        #return default_email
        # the above doesn't work
        return ['support@myslice.info']
    else:
        pi_user_hrns = [ hrn for x in pi_users for hrn in x['pi_users'] ]
        query = Query.get('user').filter_by('user_hrn', 'included', pi_user_hrns).select('user_email')
        results = execute_admin_query(request, query)
        return [result['user_email'] for result in results]

def is_pi(wsgi_request, user_hrn, authority_hrn):
    # XXX could be done in a single query !

    # select pi_authorities from user where user_hrn == "ple.upmc.jordan_auge"
    query = Query.get('user').filter_by('user_hrn', '==', user_hrn).select('pi_authorities')
    results = execute_admin_query(wsgi_request, query)
    if not results:
        # XXX Warning ?
        return False
    result = results[0]
    user_authority_hrns = result.get('pi_authorities', [])
    return authority_hrn in user_authority_hrns
    
# SFA get record

def sfa_get_user(request, user_hrn, pub):
    query_sfa_user = Query.get('user').filter_by('user_hrn', '==', user_hrn)
    result_sfa_user = execute_query(request, query_sfa_user)
    return result_sfa_user                        

def sfa_update_user(request, user_hrn, user_params):
    # user_params: keys [public_key] 
    if 'email' in user_params:
        user_params['user_email'] = user_params['email']
    query = Query.update('user').filter_by('user_hrn', '==', user_hrn).set(user_params).select('user_hrn')
    results = execute_query(request,query)
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
def manifold_delete_account(request, platform_id, user_id, account_params):
    query = Query.delete('local:account').filter_by('platform_id', '==', platform_id).filter_by('user_id', '==', user_id).set(account_params).select('user_id')
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

        if request['type'] == 'user':

            try:
                create_user(wsgi_request, request)
                request_status['SFA user'] = {'status': True }
                PendingUser.objects.get(id=request['id']).delete()
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
                create_slice(wsgi_request, request)
                request_status['SFA slice'] = {'status': True }
                PendingSlice.objects.get(id=request['id']).delete()

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
                PendingAuthority.objects.get(id=request['id']).delete()

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

    # XXX We should create a slice with Manifold terminology
    slice_params = {
        'slice_hrn'        : hrn, 
        'slice_urn'        : urn,
        'slice_type'       : request['type'],
        'users'            : user_hrns,
        'slice_enabled'    : True
    }
    # ignored in request: id, timestamp,  number_of_nodes, type_of_nodes, purpose

    query = Query.create('slice').set(slice_params).select('slice_hrn')
    results = execute_query(wsgi_request, query)
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % slice_params['hrn']
    return results

def create_pending_slice(wsgi_request, request, email):
    """
    """

    # Insert an entry in the PendingSlice table
    s = PendingSlice(
        slice_name      = request['slice_name'],
        user_hrn        = request['user_hrn'],
        authority_hrn   = request['authority_hrn'],
        number_of_nodes = request['number_of_nodes'],
        purpose         = request['purpose'],
    )
    s.save()

    try:
        # Send an email: the recipients are the PI of the authority
        recipients = authority_get_pi_emails(wsgi_request, request['authority_hrn'])

        theme.template_name = 'slice_request_email.txt' 
        text_content = render_to_string(theme.template, request)
    
        theme.template_name = 'slice_request_email.html' 
        html_content = render_to_string(theme.template, request)
    
        theme.template_name = 'slice_request_email_subject.txt'
        subject = render_to_string(theme.template, request)
        subject = subject.replace('\n', '')
    
        sender = email
        msg = EmailMultiAlternatives(subject, text_content, sender, recipients)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except Exception, e:
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

def sfa_create_user(wsgi_request, request):
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

    query = Query.create('user').set(sfa_user_params).select('user_hrn')
    results = execute_query(wsgi_request, query)
    if not results:
        raise Exception, "Could not create %s. Already exists ?" % sfa_user_params['user_hrn']
    return results

def create_user(wsgi_request, request):
    
    # XXX This has to be stored centrally
    USER_STATUS_ENABLED = 2

    # NOTE : if we were to create a user directly (just like we create slices,
    # we would have to perform the steps in create_pending_user too

    # Add the user to the SFA registry
    sfa_create_user(wsgi_request, request)

    # Update Manifold user status
    manifold_update_user(wsgi_request, request['email'], {'status': USER_STATUS_ENABLED})

    # Add reference accounts for platforms
    manifold_add_reference_user_accounts(wsgi_request, request)

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
        pi            = '',                         # XXX Why not None ?
        email_hash    = request['email_hash'],
        status        = 'False',
    )
    b.save()
    # sends email to user to activate the email
    theme.template_name = 'activate_user.html'
    html_content = render_to_string(theme.template, request)
    theme.template_name = 'activate_user.txt'
    text_content = render_to_string(theme.template, request)
    theme.template_name = 'activate_user_email_subject.txt'
    subject = render_to_string(theme.template, request)
    subject = subject.replace('\n', '')
    sender = 'support@myslice.info'
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
    except Exception, e:
        print "Failed creating manifold account on platform %s for user: %s" % ('myslice', request['email'])

    try:
        # Send an email: the recipients are the PI of the authority
        # If No PI is defined for this Authority, send to a default email (different for each theme)
        recipients = authority_get_pi_emails(wsgi_request, request['authority_hrn'])
        
        theme.template_name = 'user_request_email.html'
        html_content = render_to_string(theme.template, request)
    
        theme.template_name = 'user_request_email.txt'
        text_content = render_to_string(theme.template, request)
    
        theme.template_name = 'user_request_email_subject.txt'
        subject = render_to_string(theme.template, request)
        subject = subject.replace('\n', '')
    
        theme.template_name = 'email_default_sender.txt'
        sender =  render_to_string(theme.template, request)
        sender = sender.replace('\n', '')
    
        msg = EmailMultiAlternatives(subject, text_content, sender, recipients)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except Exception, e:
        print "Failed to send email, please check the mail templates and the SMTP configuration of your server"
        import traceback
        traceback.print_exc()
