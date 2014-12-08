from sfa.client.sfaserverproxy import SfaServerProxy
from sfa.client.return_value import ReturnValue
from django.http import HttpResponse
from rest import error
import os,json
import ConfigParser    

def servicesStatus(request):
    Config = ConfigParser.ConfigParser()
    Config.read(os.getcwd() + "/myslice/monitor.ini")
    
    result = {}
    
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
    
    services = Config.sections()
    for s in services :
        
        if s == 'monitor' : 
            continue
        
        if Config.has_option(s, 'url') :
            result[s] = {}

            if Config.has_option(s, 'name') :
                result[s]['name'] = Config.get(s, 'name')
            
            if Config.has_option(s, 'description') :
                result[s]['description'] = Config.get(s, 'description')
            
            if Config.has_option(s, 'type') :
                result[s]['type'] = Config.get(s, 'type')
                
            server = SfaServerProxy(Config.get(s, 'url'), pkey, cert)
            try:
                version = server.GetVersion()

                result[s]['status'] = 'ok'
                
                if 'interface' in version : # registry
                    result[s]['version'] = version['sfa']
                else :
                    result[s]['version'] = version['geni_api']

            except Exception, e:
                result[s]['status'] = 'ko'

        
    return HttpResponse(json.dumps(result), content_type="application/json")
