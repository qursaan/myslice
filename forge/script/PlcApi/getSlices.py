#!/usr/bin/python

import xmlrpclib
import Auth
import sys

slice_pref='upmc_'

plc_host='www.planet-lab.eu'
api_url="https://%s:443/PLCAPI/"%plc_host

plc_api= xmlrpclib.ServerProxy(api_url, allow_none=True)

sliceName = slice_pref+raw_input("Give me the name of the slice : ")

sliceWanted = None
slices = plc_api.GetSlices(Auth.auth, sliceName, ['creator_person_id', 'name', 'max_nodes', 'node_ids', 'person_ids', 'slice_id'])

if len(slices) > 0:
	for slice_i in slices:
		print slice_i['name']
	sliceWanted = slices[0]

if sliceWanted == None:
	print "The slice "+sliceName+" doesn't exist"
	sys.exit(2)
persons = plc_api.GetPersons(Auth.auth, sliceWanted['person_ids'], ['first_name', 'email'])
nodes = plc_api.GetNodes(Auth.auth, sliceWanted['node_ids'], ['hostname', 'site_id', 'node_id'])

tags = plc_api.GetSliceTags(Auth.auth, {'slice_id': sliceWanted['slice_id']}, ['description', 'tagname', 'value', 'slice_tag_id'])

creator = plc_api.GetPersons(Auth.auth, sliceWanted['creator_person_id'], ['first_name', 'email'])


for person in persons:
	print person

if creator not in persons:
	print "\tCreator"
	print "\t\t"+str(creator)
else:
	print "\tCreator is in user list"

print sliceWanted
for node in nodes:
	print "\t"+str(node)
	pass
print "Tag list"
for tag in tags:
	#print "\t"+str(tag)
	pass
