#
# Activity monitor
#
# Client is authenticated with an API key and a secret
# The API key is a 64 chars string (digits and letters) that is passed to the request
# The secret is a 64 chars string that is used to sign the request
# The generated signature is a SHA256 hes digest

import urllib, urllib2
import threading
import hmac
import hashlib
import base64
import time
import datetime
from myslice.configengine import ConfigEngine

config = ConfigEngine()
if config.activity and config.activity.apikey :
    apikey = config.activity.apikey
else :
    # apikey will be necessary
    apikey = None

if config.activity and config.activity.secret :
    secret = config.activity.secret
else :
    # secret will be necessary
    secret = None

if config.activity and config.activity.server :
    server = config.activity.server
else :
    # default log server
    server = "http://athos.ipv6.lip6.fr/log"

def logWrite(request, action, message):
    
    if not apikey :
        print "===============>> activity: no apikey"
        return
    if not secret :
        print "===============>> activity: no secret"
        return
    
    timestamp = time.mktime(datetime.datetime.today().timetuple())
    ip = getClientIp(request)
    log = {
        "timestamp" : timestamp,
        "client_ip" : ip,
        "host"      : request.get_host(),
        "referrer"  : request.META.get('HTTP_REFERER'),
        "user"      : request.user,
        "action"    : action,
        "message"   : message,
        "apikey"    : apikey,
        "signature" : sign(secret, "%s%s%s%s" % (timestamp, ip, request.user, action))
    }
    try :
        result = urllib2.urlopen(server, urllib.urlencode(log))
        content = result.read()
    except urllib2.URLError as e:
        print "===============>> activity: connection to " + url + " impossible, could not log action"

def log(request, action, message):
    # Create a new thread in Daemon mode to send the log entry
    t = threading.Thread(target=logWrite, args=(request, action, message))
    t.setDaemon(True)
    t.start()

def getClientIp(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

#
# sign the request with the secret key
def sign(secret, message):
    return hmac.new(secret, msg=message, digestmod=hashlib.sha256).hexdigest()