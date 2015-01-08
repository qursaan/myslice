#!/usr/bin/python
import xmlrpclib
import Auth

plc_host='www.planet-lab.eu'
slice_name='upmc_tp'

api_url="https://%s:443/PLCAPI/"%plc_host
plc_api= xmlrpclib.ServerProxy(api_url, allow_none=True)

N = input("Number of environment wanted :")
M = input("Number of node wanted by environment :")
sites = plc_api.GetSites(Auth.auth, ['*'], ['site_id', 'name', 'max_slices', 'slice_ids', 'node_ids'])
sitesSelected = []

i =  0
for site in sites:
	if i < N:
		j = 0
		nodesSite = plc_api.GetNodes(Auth.auth, site['node_ids'], ['hostname', 'run_level', 'boot_state'])
		for node in nodesSite:
			#print node
			if node['boot_state'] == 'boot' and node['run_level'] == 'boot':
				j+=1
		if j >= M:
			i += 1
			sitesSelected.append(site)

for site in sitesSelected:
	print site['name'], site['site_id']

if len(sitesSelected) < N:
	print "\tWe just manage to find ",len(sitesSelected),"environment"
