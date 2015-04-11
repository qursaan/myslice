from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query

from datetime import datetime
import time
import dateutil.parser
import calendar

import json, os, re, itertools

class Account:
    def __init__ (self, platform_id, user_id):
        account_query  = Query().get('local:account')\
                                .select('user_id','platform_id','auth_type','config')\
                                .filter_by('platform_id', '==', platform_id)\
                                .filter_by('user_id', '==', user_id)
 
        account_details  = execute_query(self.request, account_query)
        self.user_id     = account_details['user_id']
        self.platform_id = account_details['platform_id']
        self.auth_type   = account_details['auth_type']
        self.config      = account_details['config']
        account_config   = json.loads(account_details['config'])

        self.usr_hrn = account_config.get('user_hrn',None)
        self.pub_key = account_config.get('user_public_key',None)
        self.reference = account_config.get ('reference_platform',None)

        self.user_cred = account_config.get('delegated_user_credential',None)
        self.user_cred_expiration = get_expiration(self.user_cred)
        
        slice_creds = account_config.get('delegated_slice_credentials',None)
        for slice_name, slice_cred in slice_creds.iteritems():
            self.slice_cred_expiration = get_expiration(self.slice_cred)

        self.auth_cred = account_config.get('delegated_authority_credentials',None)
        self.auth_cred_expiration = get_expiration(self.auth_cred)

def get_expiration (credential, format = 'UTC'):
    exp_date = re.search('<expires>(.*)</expires>', credential)
    if exp_date:
        exp_date = exp_date.group(1)
        if format == 'timestamp':
            exp_date = calendar.timegm(dateutil.parser.parse(exp_date).utctimetuple())
    else:
        exp_date = None
    return exp_date

