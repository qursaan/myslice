import os
import json
import ConfigParser 
import datetime
from time                           import mktime
import time
import xmltodict

from django.shortcuts               import render_to_response
from django.http                    import HttpResponse,QueryDict

from sfa.trust.certificate          import Keypair, Certificate
from sfa.client.sfaserverproxy      import SfaServerProxy
from manifold.gateways.sfa.proxy    import SFAProxy
from sfa.client.return_value        import ReturnValue
from sfa.util.xrn                   import Xrn, get_leaf, get_authority, hrn_to_urn, urn_to_hrn

from manifold.core.query            import Query

from manifoldapi.manifoldapi        import execute_admin_query

from unfold.loginrequired           import LoginRequiredView

from myslice.settings               import logger, config

from repoze.lru                     import lru_cache
from rest.json_encoder              import MyEncoder

def dispatch(request, method):

    hrn = None
    urn = None
    object_type = None
    rspec = None
    output_format = None
    recursive = False
    # Have to be hashable for lru_cache
    options   = frozenset() # dict()
    platforms = frozenset() # list()

    results = dict()
    display = None

    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        req_items = request.GET

    logger.debug("URL = %s" % request.build_absolute_uri())

    for el in req_items.items():
        if el[0].startswith('rspec'):
            rspec += el[1]
        elif el[0].startswith('platform'):
            platforms = frozenset(req_items.getlist('platform[]'))
        elif el[0].startswith('options'):
            options_url = el[1] #req_items.getlist('options')
            options = QueryDict(options_url)
        elif el[0].startswith('output_format'):
            output_format = el[1] #req_items.getlist('options')
        elif el[0].startswith('hrn'):
            hrn = el[1]
        elif el[0].startswith('urn'):
            urn = el[1]
        elif el[0].startswith('type'):
            object_type = el[1]
        elif el[0].startswith('recursive'):
            if el[1] == '1':
                recursive = True
            else:
                recursive = False
        elif el[0].startswith('display'):
            display = el[1]

    start_time = time.time()
    results = sfa_client(request, method, hrn, urn, object_type, rspec, recursive, options, platforms, output_format, False)
    logger.debug("EXEC TIME - sfa_client() - %s sec." % (time.time() - start_time))
    if display == 'table':
        return render_to_response('table-default.html', {'data' : data, 'fields' : columns, 'id' : '@component_id', 'options' : None})
    else:
        return HttpResponse(json.dumps(results, cls=MyEncoder), content_type="application/json")

def get_user_account(request, user_email, platform_name):
    """
    Returns the user configuration for a given platform.
    This function does not resolve references.
    """
    user_query  = Query().get('local:user').filter_by('email', '==', user_email).select('user_id')
    user_details = execute_admin_query(request, user_query)
    platform_query  = Query().get('local:platform').filter_by('platform', '==', platform_name).select('platform_id')
    platform_details = execute_admin_query(request, platform_query)

    account_query  = Query().get('local:account').filter_by('platform_id','==',platform_details[0]['platform_id']).filter_by('user_id', '==', user_details[0]['user_id']).select('user_id','platform_id','auth_type','config')
    accounts = execute_admin_query(request, account_query)

    if not accounts:
        raise Exception, "this account does not exist"

    if accounts[0]['auth_type'] == 'reference':
        pf = json.loads(accounts[0]['config'])['reference_platform']
        return get_user_account(request, user_email, pf)

    return accounts[0]

#@lru_cache(100)
def sfa_client(request, method, hrn=None, urn=None, object_type=None, rspec=None, recursive=False, options=None, platforms=None, output_format=None, admin=False):

    Config = ConfigParser.ConfigParser()
    monitor_file = os.path.abspath(os.path.dirname(__file__) + '/../myslice/monitor.ini')
    Config.read(monitor_file)

    if admin:
        user_email, admin_password = config.manifold_admin_user_password()
    else:
        #logger.debug(request.session['user']['email'])
        user_email = request.session['user']['email']

    results = dict()

    if hrn is None:
        hrn = ''
    if urn is None:
        urn = ''
    if object_type is None:
        object_type = ''
    if rspec is None:
        rspec = ''
    if recursive is None:
        recursive = False
    if options is None:
        options  = dict()
    if platforms is None:
        platforms = list()

    if method not in ['GetVersion','ListResources']:
        try:
            if not hrn:
                hrn = urn_to_hrn(urn)
            else:
                urn = hrn_to_urn(hrn, object_type) 
        except Exception,e:
            logger.error(e)
            raise Exception, "Provide urn OR hrn + type as parameters of method %s" % method

    if len(platforms)==0:
        platforms = get_platforms(request)
        #platforms.append('myslice')
    #results = {'method':method,'platforms':platforms,'rspec':rspec,'options':options}

    result = []
    dict_result = {}
    data = []
    columns = []
    api_options = {}
    api_options['list_leases'] = 'all'
    server_am = False
    for pf in platforms:
        platform = get_platform_config(request, pf)
        logger.debug("platform={}".format(platform))
        if 'sm' in platform and len(platform['sm']) > 0:
            logger.debug('sm')
            server_am = True
            server_url = platform['sm']
        if 'rm' in platform and len(platform['rm']) > 0:
            logger.debug('rm')
            server_am = False
            server_url = platform['rm']
        if 'registry' in platform and len(platform['registry']) > 0:
            logger.debug('registry')
            server_am = False
            server_url = platform['registry']
    
        if not Config.has_option('monitor', 'cert') :
             #return HttpResponse(json.dumps({'error' : '-1'}), content_type="application/json")
             return {'error' : '-1', 'msg': 'monitor.ini has no cert configured'}

        cert = os.path.abspath(Config.get('monitor', 'cert'))
        if not os.path.isfile(cert) :
             #return HttpResponse(json.dumps({'error' : '-1'}), content_type="application/json")
             return {'error' : '-1', 'msg': 'check cert file at %s'%cert}

        if not Config.has_option('monitor', 'pkey') :
             #return HttpResponse(json.dumps({'error' : '-2'}), content_type="application/json")
             return {'error' : '-2'}

        pkey = os.path.abspath(Config.get('monitor', 'pkey'))
        if not os.path.isfile(pkey) :
             #return HttpResponse(json.dumps({'error' : '-2'}), content_type="application/json")
             return {'error' : '-2'}
 
        server = SfaServerProxy(server_url, pkey, cert)
        #server = SFAProxy(server_url, pkey, cert)
        if 'geni_rspec_version' in options:
            # GetVersion to know if the AM supports the requested version
            # if not ask for the default GENI v3
            start_time = time.time()
            result = server.GetVersion()
            logger.debug("EXEC TIME - GetVersion() - %s sec." % (time.time() - start_time))
            logger.debug(result)
            logger.debug(result['value'])
            if 'geni_ad_rspec_versions' in result['value']:
                for v in result['value']['geni_ad_rspec_versions']:
                    if v['type'] == options['geni_rspec_version']:
                        api_options['geni_rspec_version'] = {'type': options['geni_rspec_version']}
                        break
                    else:
                        api_options['geni_rspec_version'] = {'type': 'GENI', 'version': '3'}
        else:
            api_options['geni_rspec_version'] = {'type': 'GENI', 'version': '3'}

        try:
            # Get user config from Manifold
            user_config = get_user_config(request, user_email, pf)
            if 'delegated_user_credential' in user_config:
                logger.debug('delegated_user_credential')
                user_cred = user_config['delegated_user_credential']
            elif 'user_credential' in user_config:
                logger.debug('user_credential')
                user_cred = user_config['user_credential']
            else:
                logger.error("no user credentials for user = ", user_email)
                user_cred = {}

            if object_type:
                if 'delegated_%s_credentials'%object_type in user_config:
                    logger.debug('delegated_%s_credentials'%object_type)
                    for obj_name, cred in user_config['delegated_%s_credentials'%object_type].items():
                        if obj_name == hrn:
                            object_cred = cred
                elif '%s_credentials'%object_type in user_config:
                    logger.debug('%s_credentials'%object_type)
                    for obj_name, cred in user_config['%s_credentials'%object_type].items():
                        if obj_name == hrn:
                            object_cred = cred
                else:
                    logger.error("no credentials for object")
                    logger.error(object_type)
                    logger.error(object_name)
                    object_cred = {}

            # Both AM & Registry
            if method == "GetVersion": 
                start_time = time.time()
                result = server.GetVersion()
                logger.debug("EXEC TIME - GetVersion() - %s sec." % (time.time() - start_time))
            else:
                # AM API Calls
                if server_am:
                    if method == "ListResources":
                        logger.debug(api_options)
                        #logger.debug(user_cred)
                        start_time = time.time()
                        result = server.ListResources([user_cred], api_options)
                        logger.debug("EXEC TIME - ListResources() - %s sec." % (time.time() - start_time))
                        #logger.debug(result)
                        dict_result = xmltodict.parse(result['value'])
                        result['parsed'] = dict_result
                        if isinstance(dict_result['rspec']['node'], list):
                            columns.extend(dict_result['rspec']['node'][0].keys())
                        else:
                            columns.extend(dict_result['rspec']['node'].keys())

                    elif method == "Describe":
                        start_time = time.time()
                        version = server.GetVersion()
                        logger.debug("EXEC TIME - GetVersion() - %s sec." % (time.time() - start_time))
                        logger.debug(version['geni_api'])
                        # if GetVersion = v2
                        if version['geni_api'] == 2:
                            # ListResources(slice_hrn)
                            api_options['geni_slice_urn'] = urn
                            result = server.ListResources([object_cred], api_options)
                            dict_result = xmltodict.parse(result['value'])
                        # else GetVersion = v3
                        else:
                            result = server.Describe([urn] ,[object_cred], api_options)
                            if isinstance(result, dict):
                                if result['value'] != 0:
                                    dict_result = xmltodict.parse(result['value']['geni_rspec'])

                        result['parsed'] = dict_result
                        if 'rspec' in dict_result and 'node' in dict_result['rspec']:
                            if isinstance(dict_result['rspec']['node'], list):
                                columns.extend(dict_result['rspec']['node'][0].keys())
                            else:
                                columns.extend(dict_result['rspec']['node'].keys())

                    elif method == 'Renew':
                        # Renew till 1 month from now
                        d = datetime.datetime.utcnow() + datetime.timedelta(365/12)
                        date = d.isoformat("T") + "Z"
                        result = server.Renew([urn] ,[object_cred], date, api_options)
                    elif method == 'Delete':
                        result = server.Delete([urn] ,[object_cred], api_options)
                    elif method == 'Allocate':
                        api_options['call_id']    = unique_call_id()
                        # List of users comes from the Registry
                        api_options['sfa_users']  = sfa_users
                        api_options['geni_users'] = geni_users
                        # if GetVersion = v2
                        version = server.GetVersion()
                        if version['geni_api'] == 2:
                            result = server.CreateSliver([urn] ,[object_cred], rspec, api_options)
                        # else GetVersion = v3
                        else:
                            result = server.Allocate([urn] ,[object_cred], rspec, api_options)
                    elif method == 'Provision':
                        # if GetVersion = v2
                        # Nothing it is not supported by v2 AMs
                        version = server.GetVersion()
                        if version['geni_api'] == 3:
                            api_options['call_id']    = unique_call_id()
                            # List of users comes from the Registry
                            api_options['sfa_users']  = sfa_users
                            api_options['geni_users'] = geni_users
                            result = server.Provision([urn] ,[object_cred], api_options)
                    elif method == 'Status':
                        result = server.Status([urn] ,[object_cred], api_options)
                    elif method == 'PerformOperationalAction':
                        # if GetVersion = v2
                        # Nothing it is not supported by v2 AMs
                        version = server.GetVersion()
                        if version['geni_api'] == 3:
                            result = server.PerformOperationalAction([urn] ,[object_cred], action, api_options)
                    elif method == 'Shutdown':
                        result = server.Shutdown(urn ,[object_cred], api_options)
                    else:
                        #return HttpResponse(json.dumps({'error' : '-3','msg':'method not supported by AM'}), content_type="application/json")
                        logger.debug('method %s not handled by AM' % method)
                        result = []

                # Registry API Calls 
                else:
                    record_dict = {'urn': urn, 'hrn': hrn, 'type': object_type}
                    if method == "List":
                        # hrn is required
                        api_options['recursive'] = recursive
                        result = server.List(hrn, user_cred, api_options)
                        if object_type:
                            result = filter_records(object_type, result)
                    elif method == "Resolve":
                        # hrn is required
                        # details can be True or False
                        api_options['details']=True
                        result = server.Resolve(hrn, user_cred, api_options)
                        if object_type:
                            result = filter_records(object_type, result)
                    elif method == "Register":
                        # record_dict must be crafted
                        # auth_cred must be selected in the list of auth_creds from user's account
                        result = server.Register(record_dict, auth_cred)
                    elif method == "Update":
                        # record_dict must be crafted
                        # object_cred must be selected in the list of creds for the object type
                        # from user's account
                        result = server.Update(record_dict, object_cred)
                    elif method == "Remove":
                        # hrn is required
                        # auth_cred must be selected in the list of auth_creds from user's account
                        # object_type is required
                        result = server.Remove(hrn, auth_cred, object_type)
                    else:
                        #return HttpResponse(json.dumps({'error' : '-3','msg':'method not supported by Registry'}), content_type="application/json")
                        logger.debug('method %s not handled by Registry' % method)
                        result = []
            if output_format is not None:
                if 'value' in result:
                    # TODO Python Caching 
                    # to avoid translating the same RSpec in the same format several times
                    start_time = time.time()
                    result = translate(result['value'],output_format)
                    logger.debug("EXEC TIME - translate() - %s sec." % (time.time() - start_time))

            results[pf] = result
            if dict_result:
                if 'rspec' in dict_result and 'node' in dict_result['rspec']:
                    if isinstance(dict_result['rspec']['node'], list):
                        data = data + dict_result['rspec']['node']
                    else:
                        data.append(dict_result['rspec']['node'])
        except Exception,e:
            import traceback
            logger.error(traceback.format_exc())
            logger.error(e)
            results[pf] = {'error':'-3', 'result':result,'error_msg': str(e)}

    results['columns'] = columns
    return results

@lru_cache(100)
def translate(rspec, output_format):
    import urllib
    import urllib2

    values = {'content' : rspec}
    url = 'https://demo.fiteagle.org/omnweb/convert/to/' + output_format
    data = urllib.urlencode(values)
    req = urllib2.Request(url, data)
    response = urllib2.urlopen(req)
    return response.read()

def get_user_config(request, user_email, platform_name):
    account = get_user_account(request, user_email, platform_name)
    return json.loads(account['config']) if account['config'] else {}

def get_platforms(request):
    ret = list()
    platform_query  = Query().get('local:platform').filter_by('gateway_type', '==', 'sfa').filter_by('disabled','==',0).select('platform')
    platforms = execute_admin_query(request, platform_query)

    for p in platforms:
        ret.append(p['platform'])
    return ret

def get_platform_config(request, platform_name):
    platform_query  = Query().get('local:platform').filter_by('platform', '==', platform_name).select('platform', 'config')
    platforms = execute_admin_query(request, platform_query)

    return json.loads(platforms[0]['config']) if platforms[0]['config'] else {}

def filter_records(type, records):
    filtered_records = []
    for record in records:
        if (record['type'] == type) or (type == "all"):
            filtered_records.append(record)
    return filtered_records
