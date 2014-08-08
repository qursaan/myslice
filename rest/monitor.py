from sfa.client.sfaserverproxy import SfaServerProxy
from sfa.client.return_value import ReturnValue
from django.http import HttpResponse
from rest import error
import os,json
import ConfigParser

def sfaGetVersion(url):
    cert = os.getcwd() + "/myslice/sfa.cert"
    pkey = os.getcwd() + "/myslice/sfa.pkey"

    server = SfaServerProxy(url, pkey, cert)
    try:
        version = server.GetVersion()
    except Exception, e:
        return False
    
    return version

def servicesStatus(request):
    Config = ConfigParser.ConfigParser()
    Config.read(os.getcwd() + "/myslice/monitor.ini")
    
    result = {}
    
    services = Config.sections()
    for s in services :
        if Config.has_option(s, 'url') :
            result[s] = {}

            if Config.has_option(s, 'name') :
                result[s]['name'] = Config.get(s, 'name')
            
            if Config.has_option(s, 'description') :
                result[s]['description'] = Config.get(s, 'description')
            
            if Config.has_option(s, 'type') :
                result[s]['type'] = Config.get(s, 'type')
                
            ret = sfaGetVersion(Config.get(s, 'url'))
            
            if ret :
                result[s]['status'] = 'ok'
                
                if 'interface' in ret : # registry
                    result[s]['version'] = ret['sfa']
                else :
                    result[s]['version'] = ret['geni_api']
            else :
                result[s]['status'] = 'ko'
                
        
    return HttpResponse(json.dumps(result), content_type="application/json")