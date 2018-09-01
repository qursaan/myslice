#!/usr/bin/env python

from serviceScript import *

class String:
	def __init__(self):
		self.value = None
	
	def __str__(self):
		if self.value == None:
			return "None"
		else:
			return self.value

class Device:
	def __init__(self):
		self.id_dev = None
		self.ip = None
	
	def __str__(self):
		if self.id_dev == None:
			return "It's a new Device"
		else:
			return "Device "+self.id_dev+" --> "+self.ip

class Host:
	def __init__(self):
		self.id_host = None
		self.url = String()
		self.ssh = None
		self.devices = []
		self.services = None
		self.routes = []
		self.hostType = String()
	
	def __str__(self):
		if len(self.devices) == 0:
			return "It's a new Host"
		else:
			return "Host "+str(self.id_host)+" on "+str(self.url)+" has "+str(len(self.devices))+" device(s)"

class Slice:
	def __str__(self):
		if len(self.hosts) == 0:
			return "It's a new Slice"
		else:
			return "Slice "+str(self.slice_name)+" contain "+str(len(self.hosts))+" host(s)"

	def __init__(self):
		self.slice_name = String()
		self.hosts = []

class HostLink:
	def __init__(self):
		self.slice_name = None
		self.id_host = None
		self.url = None
		self.ssh = None
		self.bridge_name = None

	def __str__(self):
		return str(self.slice_name)+"@"+str(self.url)+"->"+str(self.bridge_name)

class Link:
	def __init__(self):
		self.host1 = None
		self.host2 = None

	def __str__(self):
		return " "+str(self.host1)+" <===> "+str(self.host2)

class Route:
	def __init__(self, slice_name, host_url, ssh, host_id):
		self.slice_name = slice_name
		self.host_url = host_url
		self.host_ssh = ssh
		self.host_id = host_id
		self.subnet = None
		self.gateway = None
		self.device = None
	
	def __str__(self):
		if self.slice_name == None:
			return "Empty route"
		else:
			return " On "+str(self.slice_name)+"@"+str(self.host_url)+" add "+self.subnet+" gw "+self.gateway+" dev "+self.device 
	
	def setRoute(self):
		execute("sudo -S sh -c  \"echo \\\"add "+self.subnet+" gw "+self.gateway+" "+self.device+"\\\" > /vsys/vroute.in\"", self.host_ssh, display = True)

class Service:
	def __init__(self, slice_name, url, ssh):
		self.slice_name = slice_name
		self.host_url = url
		self.host_ssh = ssh
		self.services = []
	
	def __str__(self):
		if len(self.services) == 0:
			retour = ''
		else:
			retour = " On "+str(self.slice_name)+"@"+str(self.host_url)+" set:"
			for service, port in self.services:
				if port != '':
					retour += "\n\t"+service+" on port "+port
				else:
					retour += "\n\t"+service
		return retour

	def setService(self):
		print "\tOn "+str(self.slice_name)+"@"+str(self.host_url)+" now setting :"
		for i in range(len(self.services)):
			if self.services[i][0] == "x11":
				setXRedirect(self.host_ssh)
			elif self.services[i][0] == "httpd":
				if port != '':
					self.services[i][1] = setHttpd(self.host_ssh, port, self.host_url)
				else:
					print "Error you didn't specified the port used by httpd"
			elif self.services[i][0] == "wireshark":
				setWireshark(self.host_ssh)
			elif self.services[i][0] == "firefox":
				setFirefox(self.host_ssh)
			elif self.services[i][0] == "php" or self.services[i][0] == 'PHP':
				setPHP(self.host_ssh)
			else:
				print "The service "+service+" is not available"

	def removeService(self):
		for service, port in self.services:
			if service == "x11":
				removeXRedirect(self.host_ssh)
			elif service == "httpd":
				removeHttpd(self.host_ssh)
			elif service == "wireshark":
				removeWireshark(self.host_ssh)
			elif service == "firefox":
				removeFirefox(self.host_ssh)
			elif service == "php" or service == 'PHP':
				removePHP(self.host_ssh)

