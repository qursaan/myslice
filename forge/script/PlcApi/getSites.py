#!/usr/bin/python
import xmlrpclib
import getpass
import Auth

plc_host='www.planet-lab.eu'

api_url="https://%s:443/PLCAPI/"%plc_host
plc_api= xmlrpclib.ServerProxy(api_url, allow_none=True)

siteId = raw_input("Give me the id of the site : ")
try:
	siteId = int(siteId)
except Exception, why:
	pass
print type(siteId)
sites = plc_api.GetSites(Auth.auth, [siteId], ['site_id', 'name', 'max_slices', 'slice_ids', 'node_ids', 'ext_consortium_id', 'login_base'])

i = j = 0
for site in sites:
	if i <= 5:
		print site
		i+=1
	else:
		j+=1

print "i = ",i," j = ",j
