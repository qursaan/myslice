from django.http import HttpResponse
from rest import error
import os,json
import ConfigParser
import string, random

from portal.models import MeasurementsDB

from manifold.core.query             import Query, AnalyzedQuery
from manifoldapi.manifoldapi         import execute_query

from influxdb import InfluxDBClient

def createDatabase(request, slicename):
    result = {}
    
    Config = config(request)
    
    server = Config.get('influxdb', 'server')
    #port = Config.get('influxdb', 'port', 8086)
    port = 8086
    user = Config.get('influxdb', 'user')
    password = Config.get('influxdb', 'password')
    
    dbname = slicename
    dbuser = request.user.username
    dbpassword = generatePassword()
    
    query = Query().get('user').filter_by('user_email', '==', dbuser).select('slices')
    slices = execute_query(request, query)
    
    if not slicename in slices:
        result['status'] = 'fail'
        result['message'] = 'no permissions'
        return HttpResponse(json.dumps(result), content_type="application/json")

    client = InfluxDBClient(server, port, user, password, dbname)
    
    try :
        client.create_database(dbname)
    except Exception as e:
        print e
    
    # Add database user
    try :
        client.add_database_user(dbuser, dbpassword)
    except Exception as e:
        print e
    
    # Make user a database admin
    client.set_database_admin(dbuser)
    
    
    # Insert an entry in the Influxdb table
    i = MeasurementsDB(
        backend         = 'influxdb',
        server          = server,
        port            = port,
        dbname          = dbname,
        dbuser          = dbuser,
        dbpassword      = dbpassword
    )
    i.save()
    
    
    result['status'] = 'ok'

    return HttpResponse(json.dumps(result), content_type="application/json")

def infoDatabase(request, slicename):
    Config = config(request)
    
    res = MeasurementsDB.objects.get(dbname=slicename, dbuser=request.user.username)
    result = {
              'server' : res.server,
              'port' : res.port,
              'dbname' : res.dbname,
              'dbuser' : res.dbuser,
              'dbpassword' : res.dbpassword
              }
    return HttpResponse(json.dumps(result), content_type="application/json")

def config(request):
    Config = ConfigParser.ConfigParser()
    Config.read(os.getcwd() + "/myslice/measurements.ini")

    if not request.user.is_authenticated :
        return HttpResponse(json.dumps({'error' : 'not authenticated'}), content_type="application/json")
    
    #if Config.has_section('influxdb') :
    if not Config.has_option('influxdb', 'server') :
        return HttpResponse(json.dumps({'error' : 'server not specified'}), content_type="application/json")
    
    if not Config.has_option('influxdb', 'user') :
        return HttpResponse(json.dumps({'error' : 'user not specified'}), content_type="application/json")
    
    if not Config.has_option('influxdb', 'password') :
        return HttpResponse(json.dumps({'error' : 'server not specified'}), content_type="application/json")
    
    return Config

def generatePassword():
    password_len = 16
    password = []
    
    for group in (string.ascii_letters, string.punctuation, string.digits):
        password += random.sample(group, 3)
    
    password += random.sample(
                     string.ascii_letters + string.punctuation + string.digits,
                     password_len - len(password))
    
    random.shuffle(password)
    password = ''.join(password)
    
    
    return password
    

