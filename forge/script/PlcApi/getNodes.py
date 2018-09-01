#!/usr/bin/python
import xmlrpclib
import getpass
import Auth

plc_host='www.planet-lab.eu'

api_url="https://%s:443/PLCAPI/"%plc_host
plc_api= xmlrpclib.ServerProxy(api_url, allow_none=True)

nodeId = int(raw_input("Give me the node id: "))

nodes = plc_api.GetNodes(Auth.auth, [nodeId], ['boot_state', 'site_id', 'hostname'])

for node in nodes:
	print node
