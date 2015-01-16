#!/usr/bin/python
from Auth import *

nodesLxc = plc_api.GetNodeTags(auth, {'value': 'lxc', 'tagname':'pldistro'}, ['node_id', 'hostname'])

site_ids = []
for node in nodesLxc:
	site_ids.append(plc_api.GetNodes(auth, node['node_id'], ['site_id'])[0]['site_id'])

sites = plc_api.GetSites(auth, site_ids, ['site_id', 'name', 'abbreviated_name'])
for site in sites:
	print site
