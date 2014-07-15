#
# Activity monitor
#

import urllib, urllib2
import threading
from datetime import datetime


def logWrite(request, action, message):
    url = "http://localhost:5000/log"
    log = {
        "date" : datetime.today(),
        "client_ip" : getClientIp(request),
        "host" : request.get_host(),
        "referrer" : request.META.get('HTTP_REFERER'),
        "user" : request.user
    }
    
    try :
        result = urllib2.urlopen(url, urllib.urlencode(log))
        content = result.read()
    except urllib2.URLError as e:
        print "Error: connection to " + url + " impossible, logging disabled"

def spawnThread(request, action, message):
    print "aaaaaaaaa"
    # Create a new thread in Daemon mode to send the log entry
    t = threading.Thread(target=logWrite, args=(request, action, message))
    t.setDaemon(True)
    t.start()

def userLogin(request):
    spawnThread(request, 'userlogin', 'User logged in')

def userLogout(request):
    spawnThread(request, 'userlogout', 'User logged out')

def userRegistration(request):
    spawnThread(request, 'userregistration', 'User registered')

def userSliceRequest(request):
    spawnThread(request, 'userslicerequest', 'User requested a slice')

def userContactSupport(request):
    spawnThread(request, 'usercontactsupport', 'User contacted suppport')

def userAddResource(request):
    spawnThread(request, 'useraddresource', 'User added resource to slice')

def userDelResource(request):
    spawnThread(request, 'userdelresource', 'User removed resource from slice')


def getClientIp(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip