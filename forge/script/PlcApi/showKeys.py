#!/usr/bin/env python

from Auth import *

keyId = plc_api.GetKeys(auth, {'person_id': 249241}, ['key_id', 'key'])
for key in keyId:
		print "A new key:"
		print "Key value ->", key['key']
		print "Key id ->",key['key_id']

