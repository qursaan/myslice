from sfa.trust.certificate              import Keypair, Certificate
from sfa.client.sfaserverproxy import SfaServerProxy
from sfa.client.return_value import ReturnValue

from manifold.core.query        import Query

from django.shortcuts               import render_to_response

from unfold.loginrequired           import LoginRequiredView

from rest import ObjectRequest, error

from string import join

from django.http import HttpResponse
from rest import error
import os,json

def dispatch(request, method):
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
        platform_query = Query().get('local:platform').filter_by('platform', '==', pf).select('config')
        platform_result = execute_admin_query(request, platform_query)
        platform = json.loads(platform_result[0]['config'])
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
    
        pkey_path = os.path.abspath(platform['user_private_key'])
        if not os.path.isfile(pkey_path) :
             return HttpResponse(json.dumps({'error' : '-2'}), content_type="application/json")
        pkey_file = open(pkey_path,'r')
        pkey = pkey_file.read()
        x = pkey.encode('latin1')
        keypair = Keypair(string=x)
        self_signed = Certificate(subject = platform['user'])
        self_signed.set_pubkey(keypair)
        self_signed.set_issuer(keypair, subject=platform['user'].encode('latin1'))
        self_signed.sign()
        sscert_path = self_signed.save_to_random_tmp_file()
        print "path of tmp sscert: %s" % sscert_path
        print server_url
        server = SfaServerProxy(server_url, pkey_path, sscert_path)
        os.remove(sscert_path)
       
        if method == "GetVersion": 
            print "this is the result of GetVersion:"
            result = server.GetVersion()
        else:
            return HttpResponse(json.dumps({'error' : '-1','msg':'method not supported yet'}), content_type="application/json")

        results[pf] = result
    return HttpResponse(json.dumps(results), content_type="application/json")
