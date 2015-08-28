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
from myslice.settings import logger
import random
import os
import sqlite3 as lite
import json
import syslog

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
    server = "http://athos.ipv6.lip6.fr/activity/push/log"

def logWrite(request, action, message, objects = None):
    
    if not apikey :
        logger.info("===============>> activity: no apikey")
        return
    if not secret :
        logger.info("===============>> activity: no secret")
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
        "signature" : sign(secret, "%s%s%s%s" % (timestamp, ip, request.user, action)),
        "slice"     : None,
        "resource"  : None,
        "resource_type"     : None,
        "facility"      : None,
        "testbed"       : None,
    }
    
    if objects is not None:
        for o in objects :
            if (o in log) :
                log[o] = objects[o]
    
    try :
        result = urllib2.urlopen(server, urllib.urlencode(log))
        logger.info("===============>> activity: {} <{}> {}".format(action, request.user,message))
        content = result.read()

        #checking for not sent data and sending it (50% probability)
        if random.randint(0,100) < 50:
            logCheck()

    except urllib2.URLError as e:
        logger.error("===============>> activity: connection to {} impossible, could not log action".format(server))
        logger.error(e.strerror)

        dbfile = ''.join([os.path.dirname(os.path.abspath(__file__)), "/errors.db"])
        conn = None
        try:
            conn = lite.connect(dbfile)
            cur = conn.cursor()
            cur.execute("""INSERT INTO logs(log) values('%s')""" % json.dumps(log))
            conn.commit()
        except lite.Error, e:
            # this means that writing log into db also failed :(
            # Last chance to preserve log is to send it to system syslog
            # however there is no mechanism to pull it from this log - just manually.
            logger.error('[activity] Error while inserting into sql db: %s' % str(e.args))
            logger.error("[activity] data to send: '%s'" % json.dumps(log))
        if conn:
            conn.close()

def log(request, action, message, objects = None):
    # Create a new thread in Daemon mode to send the log entry
    t = threading.Thread(target=logWrite, args=(request, action, message, objects))
    t.setDaemon(True)
    t.start()

def getClientIp(request):
    try :
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        ip = x_forwarded_for.split(',')[0]
    except:
        ip = request.META.get('REMOTE_ADDR')
    return ip

#
# sign the request with the secret key
def sign(secret, message):
    return hmac.new(secret, msg=message, digestmod=hashlib.sha256).hexdigest()

#
# sending the logs cached in sqlite database

def logCheck():
    """Checking local database for logs adn sending it to monitoring server"""
    dbfile = ''.join([os.path.dirname(os.path.abspath(__file__)), "/errors.db"])
    conn = None

    #trying to connect local db adn pull unsent logs
    try:
        conn = lite.connect(dbfile)
        cur = conn.cursor()
        cur.execute("SELECT rowid, log from logs")
        notsent = cur.fetchall()
        for row in notsent:
            #trying to send unsent data from sqlite db
            try :
                urllib2.urlopen(config.activity.server, urllib.urlencode(json.loads(row[1])))
                #delete those who were sent
                cur.execute("""DELETE FROM logs where rowid = %s""" % row[0] )
                conn.commit()
            except urllib2.URLError as e:
                # this is just to inform that DB is not working properly
                logger.error('[activity] Error while sending stats')
                logger.error(e.strerror)

    except lite.Error, e:
        #this need to be updated to store information via syslog
        logger.error('[activity] Error while pulling from local sqlite3 db: %s' % str(e.args))
        logger.error(e.strerror)
    if conn:
        conn.close()

    return
