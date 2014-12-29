#!/usr/bin/python
import xmlrpclib
import Auth

plc_host='www.planet-lab.eu'
slice_pref='upmc_'

slice_name=slice_pref+raw_input('Give me the name of the slice : ')

api_url="https://%s:443/PLCAPI/"%plc_host
plc_api= xmlrpclib.ServerProxy(api_url, allow_none=True)

# The slice's node ids
node_ids = plc_api.GetSlices(Auth.auth, slice_name,['node_ids'])[0]['node_ids']

# Get Hostname for these nodes
slice_nodes = plc_api.GetNodes(Auth.auth, node_ids, ['hostname', 'run_level'])

for node in slice_nodes:
	print node
