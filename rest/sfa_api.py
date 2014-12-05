from sfa.trust.certificate      import Keypair, Certificate
from sfa.client.sfaserverproxy  import SfaServerProxy
from sfa.client.return_value    import ReturnValue
from sfa.util.xrn               import Xrn, get_leaf, get_authority, hrn_to_urn, urn_to_hrn
from manifold.core.query        import Query
from manifold.models            import db
from manifold.models.platform   import Platform
from manifold.models.user       import User

from django.shortcuts           import render_to_response

from unfold.loginrequired       import LoginRequiredView

from rest import ObjectRequest, error

from string import join

from django.http import HttpResponse
from rest import error
import os,json

import ConfigParser 

def dispatch(request, method):
    Config = ConfigParser.ConfigParser()
    Config.read(os.getcwd() + "/myslice/monitor.ini")

    # hardcoded user to be replaced by auth
    user_email = "loic.baron@lip6.fr"

    # Get this as parameters
    slice_hrn = "fed4fire.upmc.berlin"
    urn = hrn_to_urn(slice_hrn, "slice")
    #urn = hrn_to_urn("fed4fire.upmc.loic_baron", "user")

    platforms = list()
    options   = list()
    rspec = ''
    results = dict()

    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        req_items = request.GET

    for el in req_items.items():
        if el[0].startswith('rspec'):
            rspec += el[1]
        if el[0].startswith('platform'):
            platforms += req_items.getlist('platform[]')
        elif el[0].startswith('options'):
            options += req_items.getlist('options[]')

    if len(platforms)==0:
        platforms.append('myslice')
    #results = {'method':method,'platforms':platforms,'rspec':rspec,'options':options}

    from manifoldapi.manifoldapi    import execute_admin_query
    for pf in platforms:
        platform = get_platform_config(pf)
        print platform
        if 'sm' in platform and len(platform['sm']) > 0:
            print 'sm'
            server_url = platform['sm']
        if 'rm' in platform and len(platform['rm']) > 0:
            print 'rm'
            server_url = platform['rm']
        if 'registry' in platform and len(platform['registry']) > 0:
            print 'registry'
            server_url = platform['registry']
    
        if not Config.has_option('monitor', 'cert') :
             return HttpResponse(json.dumps({'error' : '-1'}), content_type="application/json")

        cert = os.path.abspath(Config.get('monitor', 'cert'))
        if not os.path.isfile(cert) :
             return HttpResponse(json.dumps({'error' : '-1'}), content_type="application/json")

        if not Config.has_option('monitor', 'pkey') :
             return HttpResponse(json.dumps({'error' : '-2'}), content_type="application/json")

        pkey = os.path.abspath(Config.get('monitor', 'pkey'))
        if not os.path.isfile(pkey) :
             return HttpResponse(json.dumps({'error' : '-2'}), content_type="application/json")
 
        server = SfaServerProxy(server_url, pkey, cert)

        # Get user config from Manifold
        user_config = get_user_config(user_email, pf)
        if 'delegated_user_credential' in user_config:
            user_cred = user_config['delegated_user_credential']
        else:
            user_cred = {}

        #if 'delegated_slice_credentials' in user_config:
        #    for slice_name, cred in user_config['delegated_slice_credentials']:
        #        if slice_name == slice_param

        if method == "GetVersion": 
            result = server.GetVersion()
        elif method == "ListResources":
            api_options = {}
            #api_options ['call_id'] = unique_call_id()
            api_options['geni_rspec_version'] = {'type': 'GENI', 'version': '3'}
            result = server.ListResources([user_cred], api_options)
        elif method == "Describe":
            api_options = {}
            #api_options ['call_id'] = unique_call_id()
            api_options['geni_rspec_version'] = {'type': 'GENI', 'version': '3'}
            result = server.Describe([urn] ,[object_cred], api_options)

        else:
            return HttpResponse(json.dumps({'error' : '-3','msg':'method not supported yet'}), content_type="application/json")

        results[pf] = result

    return HttpResponse(json.dumps(results), content_type="application/json")

def get_user_account(user_email, platform_name):
    """
    Returns the user configuration for a given platform.
    This function does not resolve references.
    """
    user = db.query(User).filter(User.email == user_email).one()
    platform = db.query(Platform).filter(Platform.platform == platform_name).one()
    accounts = [a for a in user.accounts if a.platform == platform]
    if not accounts:
        raise Exception, "this account does not exist"

    if accounts[0].auth_type == 'reference':
        pf = json.loads(accounts[0].config)['reference_platform']
        return get_user_account(user_email, pf)

    return accounts[0]

def get_user_config(user_email, platform_name):
    account = get_user_account(user_email, platform_name)
    return json.loads(account.config) if account.config else {}

def get_platform_config(platform_name):
    platform = db.query(Platform).filter(Platform.platform == platform_name).one()
    return json.loads(platform.config) if platform.config else {}
