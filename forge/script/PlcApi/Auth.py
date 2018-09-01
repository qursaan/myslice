#!/usr/bin/python
import xmlrpclib

auth={'AuthMethod': 'password', 'Username': 'pierre.vigreux@lip6.fr', 'AuthString': '1245780'}

plc_host='www.planet-lab.eu'
api_url="https://%s:443/PLCAPI/"%plc_host

plc_api= xmlrpclib.ServerProxy(api_url, allow_none=True)

def printRes(results):
	for result in results:
		print result
