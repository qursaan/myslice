import os
import json
import ConfigParser 
import datetime
from time                       import mktime
import xmltodict

from django.shortcuts           import render_to_response
from django.http                import HttpResponse

from sfa.trust.certificate      import Keypair, Certificate
from sfa.client.sfaserverproxy  import SfaServerProxy
from sfa.client.return_value    import ReturnValue
from sfa.util.xrn               import Xrn, get_leaf, get_authority, hrn_to_urn, urn_to_hrn

from manifold.core.query        import Query

from manifoldapi.manifoldapi    import execute_admin_query

from unfold.loginrequired       import LoginRequiredView

from myslice.settings           import logger, config

from rest.json_encoder          import MyEncoder

def dispatch(request, method):

    hrn = ''
    urn = ''
    object_type = ''
    rspec = ''
    recursive = False
    options   = dict()
    platforms = list()

    results = dict()
    display = None

    if request.method == 'POST':
        req_items = request.POST
    elif request.method == 'GET':
        req_items = request.GET

    for el in req_items.items():
        if el[0].startswith('rspec'):
            rspec += el[1]
        elif el[0].startswith('platform'):
            platforms = req_items.getlist('platform[]')
        #elif el[0].startswith('options'):
        #    options += req_items.getlist('options[]')
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

    results = sfa_client(request, method, hrn=hrn, urn=urn, object_type=object_type, recursive=recursive, options=options, platforms=platforms)
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

def sfa_client(request, method, hrn=None, urn=None, object_type=None, rspec=None, recursive=None, options=None, platforms=None, admin=False):

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
        platforms = get_platforms()
        #platforms.append('myslice')
    #results = {'method':method,'platforms':platforms,'rspec':rspec,'options':options}

    result = []
    dict_result = {}
    data = []
    columns = []
    api_options = {}
    api_options['geni_rspec_version'] = {'type': 'GENI', 'version': '3'}
    api_options['list_leases'] = 'all'
    server_am = False
    for pf in platforms:
        platform = get_platform_config(pf)
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

        try:
            # Get user config from Manifold
            user_config = get_user_config(request, user_email, pf)
            if 'delegated_user_credential' in user_config:
                user_cred = user_config['delegated_user_credential']
            elif 'user_credential' in user_config:
                user_cred = user_config['user_credential']
            else:
                user_cred = {}

            if object_type:
                if 'delegated_%s_credentials'%object_type in user_config:
                    for obj_name, cred in user_config['delegated_%s_credentials'%object_type].items():
                        if obj_name == hrn:
                            object_cred = cred
                elif '%s_credentials'%object_type in user_config:
                    for obj_name, cred in user_config['%s_credentials'%object_type].items():
                        if obj_name == hrn:
                            object_cred = cred

            # Both AM & Registry
            if method == "GetVersion": 
                result = server.GetVersion()
            else:
                # AM API Calls
                if server_am:
                    if method == "ListResources":
                        result = server.ListResources([user_cred], api_options)
                        dict_result = xmltodict.parse(result['value'])
                        result['parsed'] = dict_result
                        if isinstance(dict_result['rspec']['node'], list):
                            columns.extend(dict_result['rspec']['node'][0].keys())
                        else:
                            columns.extend(dict_result['rspec']['node'].keys())

                    elif method == "Describe":
                        version = server.GetVersion()
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
                        # if GetVersion = v2
                        # CreateSliver(slice_hrn)
                        # else GetVersion = v3
                        api_options['call_id']    = unique_call_id()
                        # List of users comes from the Registry
                        api_options['sfa_users']  = sfa_users
                        api_options['geni_users'] = geni_users
                        result = server.Allocate([urn] ,[object_cred], rspec, api_options)
                    elif method == 'Provision':
                        # if GetVersion = v2
                        # Nothing it is not supported by v2 AMs
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
            results[pf] = {'error':'-3', 'error_msg': str(e)}

    results['columns'] = columns
    return results

def get_user_config(request, user_email, platform_name):
    account = get_user_account(request, user_email, platform_name)
    return json.loads(account['config']) if account['config'] else {}

def get_platforms():
    ret = list()
    platform_query  = Query().get('local:platform').filter_by('gateway_type', '==', 'sfa').filter_by('disabled','==',0).select('platform')
    platforms = execute_admin_query(request, platform_query)

    for p in platforms:
        ret.append(p['platform'])
    return ret


def get_platform_config(platform_name):
    platform_query  = Query().get('local:platform').filter_by('platform', '==', platform_name).select('platform', 'config')
    platforms = execute_admin_query(request, platform_query)

    return json.loads(platforms[0]['config']) if platforms[0]['config'] else {}

def filter_records(type, records):
    filtered_records = []
    for record in records:
        if (record['type'] == type) or (type == "all"):
            filtered_records.append(record)
    return filtered_records
