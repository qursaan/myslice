#!/usr/bin/env python
# Update with latest key

from Auth import *

keyId = plc_api.GetKeys(auth, {'person_id': 249241}, ['key_id'])
for key in keyId:
	if key['key_id'] != 117822:
		plc_api.DeleteKey(auth, key['key_id'])
		print "Deleting a key id ->",key['key_id']

