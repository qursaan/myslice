import sys
import urllib
import urllib2
import json
import socket
from urlparse import urlparse
from database import Database

class LaboraSchedulerClient:
    """
    A simple rest shell to a Labora Scheduler instance
    This class can receive Labora API  calls to the underlying testbed
    """
                
    direct_calls = [ 'get_testbed_info', 'get_users', 'add_user', 'delete_user', 'update_user',
                     'get_user_id_by_username', 'add_user_public_key', 'delete_user_public_key' ]

    def __init__ ( self, organization ):
        self.url, self.key = self.getOrganizationConfigs( organization )


    def __getattr__(self, name):
        
        def func(*args, **kwds):
            actual_name = None
            
            if name in LaboraSchedulerClient.direct_calls:
                actual_name = name
            
            if not actual_name:
                raise Exception, "Method %s not found in Labora Scheduler"%(name)
                return
                
            if not self.url or not self.key:
                raise Exception, "Missing Labora Scheduler island url and/or key."
                return
                
            address = self.url + "?method=" + actual_name + "&key=" + self.key
            
            # get the direct_call parameters
            method_parameters = []
            
            if actual_name == "get_users":
                method_parameters.extend(['filter'])
            elif actual_name == "update_user":
                method_parameters.extend(['user_id', 'new_user_data'])
            elif actual_name == "delete_user" or actual_name == "delete_user_public_key":
                method_parameters.extend(['user_id'])
            elif actual_name == "get_user_id_by_username":
                method_parameters.extend(['username'])
            elif actual_name == "add_user":
                method_parameters.extend(['username', 'email', 'password', 'name', 'gidnumber',
                                          'homedirectory', 'created_by'])
            elif actual_name == "add_user_public_key":
                method_parameters.extend(['user_id', 'public_key'])
            
            for parameter in args:
                if isinstance(parameter, (frozenset, list, set, tuple, dict)):
                    for key_name in parameter.keys():
                        
                        if key_name in method_parameters:
                            param_value = parameter[key_name]
                            
                            if param_value == None:
                                continue
                            
                            if isinstance(param_value, (frozenset, list, set, tuple, dict)):
                                param_value = json.dumps(param_value)
                            
                            param_value = urllib.quote(param_value.encode('utf-8'))
                            
                            address += "&" + key_name + "=" + param_value
            
            api_call = urllib2.urlopen(address)
            api_call = json.load(api_call)
            
            if not api_call['call_status']:
                result = api_call['method_result']
            else:
                result = False


            return result
            
        return func
        
        
    def getOrganizationConfigs( self, organization ):
        ls_url = None
        ls_key = None
        
        databaseConfig = {
            'dbHost'        : '10.128.11.200',
            'dbUser'        : 'postgres',
            'dbPassword'    : '5e6b70f2e9dc',
            'dbName'        : 'LaboraSchedulerNOC'
        }
        
        databaseConnection = Database( databaseConfig )
        
        query = "SELECT * FROM islands WHERE domain ='" + organization + "'"
        orgConfig = databaseConnection.fetchRows( query )

        if orgConfig:
            ls_url = orgConfig[0]["ls_url"]
            ls_key = orgConfig[0]["ls_key"]
        
        return ls_url, ls_key
