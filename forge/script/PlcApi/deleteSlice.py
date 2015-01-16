#!/usr/bin/python

import xmlrpclib
import Auth
import sys

plc_host='www.planet-lab.eu'
slice_pref='upmc_'

api_url='https://%s:443/PLCAPI/'%plc_host
plc_api=xmlrpclib.ServerProxy(api_url, allow_none=True)

slice_name = slice_pref+raw_input('Give the name of the slice : ')

try:
	returnCode = plc_api.DeleteSlice(Auth.auth, slice_name)
except Exception, why:
	print "An error occured while trying to delete the slice "+slice_name
	print why
	sys.exit(2)
if returnCode != 1:
	print "An error occured while trying to delete the slice "+slice_name
