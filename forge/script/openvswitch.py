#!/usr/bin/env python

import sys
import argparse

import logging
import paramiko
import signal
import os
import time

# Import the class used (Slice, Host, Device, Link, HostLink)
from classDefinition import *

from exceptionDefinition import SSHConnectError

class TransformXml:
	
	def __init__(self, confFile = 'Conf.xml', linkFile = 'Link.xml', prefix = '', port = 22, keyFile = '~/.ssh/id_rsa'):
		self.__currentNodeConf__ = None
		self.__currentNodeLink__ = None
		self.__currentNodeRoute__= None
		self.__currentNodeService__ = None
		self.__sliceList__ = []
		self.__linkList__ = []
		
		self.readXml(prefix+confFile, prefix+linkFile)
		self.sshPort = port
		self.sshKey = keyFile
		self.xmlToSliceObject()
		self.xmlToLinkObject()
	
	def readXml(self, confPath, linkPath):
		from xml.dom.minidom import parse
		if not(os.path.isfile(confPath) and os.path.isfile(linkPath)):
			print "Error file "+confPath+" or "+linkPath+" does not exist"
			sys.exit(2)
		self.conf = parse(confPath)
		self.link = parse(linkPath)
	
	def getRootElementConf(self):
		if self.__currentNodeConf__ == None:
			self.__currentNodeConf__ = self.conf.documentElement
		return self.__currentNodeConf__
	
	def getRootElementLink(self):
		if self.__currentNodeLink__ == None:
			self.__currentNodeLink__ = self.link.documentElement
		return self.__currentNodeLink__
	
	def xmlToServiceObject(self, rootService, host, slice_name):
		i = 0
		newService = Service(slice_name, host.url, host.ssh)
		for service_i in rootService.getElementsByTagName("service"):
			try:
				 service = self.getText(service_i)
			except:
				print "The tag service is missig"
			servicePart = service.partition(':')
			newService.services.append([servicePart[0], servicePart[2]])
		host.services = newService

	def setServices(self):
		print "Now setting the service"
		for slice_i in self.__sliceList__:
			for host_i in slice_i.hosts:
				host_i.services.setService()
			
	def xmlToRouteObject(self, rootRoute, host, sliceName):
		for route_i in rootRoute.getElementsByTagName("route"):
			newRoute = Route(sliceName, host.url, host.ssh, host.id_host)
			try:
				newRoute.subnet = self.getText(route_i.getElementsByTagName("subnet")[0])
				newRoute.gateway = self.getText(route_i.getElementsByTagName("gateway")[0])
				devId = self.getText(route_i.getElementsByTagName("device")[0])
			except:
				print "The tag subnet / gateway or device is missing"
				sys.exit(2)
			newRoute.device = self.getTapId(newRoute, devId, host)
			host.routes.append(newRoute)

	def setRoutes(self):
		for slice_i in self.__sliceList__:
			for host_i in slice_i.hosts:
				for route_i in host_i.routes:
					route_i.setRoute()

	def xmlToSliceObject(self):
		i = j = k = 0
		for slice_i in self.getRootElementConf().getElementsByTagName("slice"):
			i += 1
			newSlice = Slice()
			try:
				newSlice.slice_name.value = self.getText(slice_i.getElementsByTagName("slice_name")[0])
			except :
				print "The tag slice_name is missing"
				sys.exit(2)
			for host_i in slice_i.getElementsByTagName("host"):
				j+=1
				newHost = Host()
				try:
					newHost.hostType.value = self.getText(host_i.getElementsByTagName("type")[0])
					newHost.id_host = self.getText(host_i.getElementsByTagName("id")[0])
					newHost.url.value = self.getText(host_i.getElementsByTagName("url")[0])
				except Exception, why:
					print "Tag id or url is missing"
					print "Slice",newSlice.slice_name," Host ",newHost.url," Interface ",str(k)
					print "Why -> ", why
					sys.exit(2)
				newHost.ssh = self.sshCheck(newHost.url.value, newSlice.slice_name.value)
				for interface_i in host_i.getElementsByTagName("interface"):
					k+=1
					newDevice = Device()
					try:
						newDevice.id_dev = self.getText(interface_i.getElementsByTagName("bridge_name")[0])
						newDevice.ip = self.getText(interface_i.getElementsByTagName("ip")[0])
					except:
						print "Tag bridge_name or ip is missing"
						#sys.exit(2)
					newHost.devices.append(newDevice)
				try:
					serviceRoot = host_i.getElementsByTagName("services")[0]
					self.xmlToServiceObject(serviceRoot, newHost, newSlice.slice_name)
				except:
					newHost.services = Service("","","")
				try:
					routeRoot = host_i.getElementsByTagName("routes")[0]
					self.xmlToRouteObject(routeRoot, newHost, newSlice.slice_name)
				except:
					print "No additionnal route for host "+str(newSlice.slice_name)+"@"+str(newHost.url)
				newSlice.hosts.append(newHost)
			self.__sliceList__.append(newSlice)

	def setSliceConf(self):
		for slice_i in self.__sliceList__:
			for host_i in slice_i.hosts:
				if len(host_i.devices) > 0:
					print "\tOn "+str(slice_i.slice_name)+"@"+str(host_i.url)
					self.execute("sudo -S sliver-ovs start_db", host_i.ssh, display = True)
					self.execute("sudo -S sliver-ovs start_switch", host_i.ssh, display = True)
					for interface_i in host_i.devices:
						returnCode = -1
						i = 0
						while returnCode != 0:
							returnCode = self.execute("sudo -S sliver-ovs create_bridge "+interface_i.id_dev+" "+interface_i.ip,host_i.ssh)
	
							if returnCode != 0:
								i += 1
								self.execute("sudo -S sliver-ovs del_bridge "+interface_i.id_dev, host_i.ssh)
								if i > 10:
									print "I have make ",i," iteration"
								time.sleep(60)
							else:
								print "I make",i,"iteration before successfully create the interface"
	
	def xmlToLinkObject(self):
		for link_i in self.getRootElementLink().getElementsByTagName("link"):
			newLink = Link()
			newHost1 = HostLink()
			newHost2 = HostLink()
			try:
				host1 = link_i.getElementsByTagName("host1")[0]
				host2 = link_i.getElementsByTagName("host2")[0]
			except:
				print "Tag host1/host2 is missing"
				sys.exit(2)
			try:
				newHost1.slice_name = self.getText(host1.getElementsByTagName("slice")[0])
				newHost1.id_host = self.getText(host1.getElementsByTagName("id")[0])
				newHost1.bridge_name = self.getText(host1.getElementsByTagName("bridge_name")[0])
			except:
				print "Tag slice, id or bridge_name is missing for host1"
				sys.exit(2)
			try:
				newHost2.slice_name = self.getText(host2.getElementsByTagName("slice")[0])
				newHost2.id_host = self.getText(host2.getElementsByTagName("id")[0])
				newHost2.bridge_name = self.getText(host2.getElementsByTagName("bridge_name")[0])
			except:
				print "Tag slice, id or bridge_name is missing for host2"

			newHost1.ssh, newHost1.url = self.getSSHAccessUrl(newHost1.slice_name, newHost1.id_host )
			newHost2.ssh, newHost2.url = self.getSSHAccessUrl(newHost2.slice_name, newHost2.id_host )
			newLink.host1 = newHost1
			newLink.host2 = newHost2
			self.__linkList__.append(newLink)

	def setLinks(self):
		import subprocess
		print "Creating Links"
		for link_i in self.__linkList__:
			host1 = link_i.host1
			host2 = link_i.host2
			link_name_host1 = host1.slice_name+"@"+str(host1.url)+"@"+host1.bridge_name
			link_name_host2 = host2.slice_name+"@"+str(host2.url)+"@"+host2.bridge_name
			link_name = link_name_host1+"---"+link_name_host2
			print "\tOn "+str(host1.slice_name)+"@"+str(host1.url)
			self.execute("sudo -S sliver-ovs create_port "+host1.bridge_name+" "+link_name, host1.ssh)
			print "\tOn "+str(host2.slice_name)+"@"+str(host2.url)
			self.execute("sudo -S sliver-ovs create_port "+host2.bridge_name+" "+link_name, host2.ssh)
			proc = subprocess.Popen(["host "+str(host1.url)+" | sed -n 's/^.*has address *//p'"], stdout=subprocess.PIPE, shell=True)
			(out, err) = proc.communicate()
			ip1 = out.replace('\n','')
			proc = subprocess.Popen(["host "+str(host2.url)+" | sed -n 's/^.*has address *//p'"], stdout=subprocess.PIPE, shell=True)
			(out, err) = proc.communicate()
			ip2 = out.replace('\n','')
			portUDP1 = self.execute("sudo -S sliver-ovs get_local_endpoint "+link_name, host1.ssh, retour=True).replace('\n','')
			portUDP2 = self.execute("sudo -S sliver-ovs get_local_endpoint "+link_name, host2.ssh, retour=True).replace('\n','')
			print "\tPort UDP1 = "+str(portUDP1)+" Port UDP2 = "+str(portUDP2)
			self.execute("sudo -S sliver-ovs set_remote_endpoint "+link_name+" "+ip2+" "+portUDP2, host1.ssh)
			self.execute("sudo -S sliver-ovs set_remote_endpoint "+link_name+" "+ip1+" "+portUDP1, host2.ssh)

	def getSSHAccessUrl(self, slice_name, id_host):
		host_search = self.getHost(slice_name, id_host)
		return host_search.ssh, host_search.url

	def getHost(self, slice_name, host_id):
		i = j = 0
		slice_search = self.__sliceList__[i]
		try:
			while slice_search.slice_name.value != slice_name:
				i+=1
				slice_search = self.__sliceList__[i]
			host_search = slice_search.hosts[j]
			while host_search.id_host != host_id:
				j+=1
				host_search = slice_search.hosts[j]
		except IndexError:
			print "The host in slice ->",slice_name,"and host id ->",host_id,"doesn't exist"
			print "\tAn IndexError occured"
			sys.exit(2)
		return host_search

	def getUrl(self, slice_name, id_host):
		host_search = self.getHost(slice_name, id_host)
		return host_search.url

	def getTapId(self, route, idDev, host):
		idUser = self.execute("id -u", route.host_ssh, retour = True).replace('\n','')
		i = 0
		dev_searched = host.devices[i]
		try:
			while dev_searched.id_dev != idDev:
				i += 1
				dev_searched = host_searched.devices[i]
		except IndexError:
			print "Error while setting the route"
			print "For slice ->",host_searched.slice_name," id host ->",host_searched.id_host," the following device does not exist ->",idDev
			sys.exit(2)
		return "tap"+idUser+"-"+str(i)

	#TODO change the function for online mode
	def sshCheck(self, host, slice_name):
		ssh = paramiko.SSHClient()
		ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
		try:
			ssh.connect(host, username=slice_name, port=self.sshPort, key_filename=self.sshKey)
			pass
		# This error is raised if the ssh key has not already been installed on the node
		except paramiko.PasswordRequiredException, why:
			print "Password required exception"
			print "Error: ", why
			raise SSHConnectError(host, slice_name)
		except paramiko.SSHException:
			print "An SSH exception occured"
			raise SSHConnectError(host, slice_name)
		except Exception, why:
			print "An error occured for host "+str(host)+" on slice "+str(slice_name)
			print why
			raise SSHConnectError(host, slice_name)
		return ssh

	def timeout(signum, frame):
		raise TimeOutException, "Command ran for too long"

	def getText(self, node):
		return node.childNodes[0].nodeValue
	
	def execute(self, command, ssh, display=False, retour=False):
		print "# "+command
		stdin, stdout, stderr = ssh.exec_command(command)
		stdin.close()
		while not stdout.channel.exit_status_ready():
			time.sleep(2)
		err = stderr.read()
		if err != None:
			splitted = err.splitlines()
			if len(splitted) > 0:
				print "\tError in execution"
				for line in splitted:
					print "\t>",line
		if display:
			for line in stdout.read().splitlines() :
				print " > " + line
		elif retour:
			return stdout.read()
		return stdout.channel.recv_exit_status()
	
	def clearConf(self):
		print "Removing the topology configuration"
		for slice_i in self.__sliceList__:
			for host_i in slice_i.hosts:
				self.sshCheck(host_i.url.value, slice_i.slice_name.value)
				print "\tOn "+str(slice_i.slice_name)+"@"+str(host_i.url)+" clearing the conf :"
				sshHost = host_i.ssh
				for device_i in host_i.devices:
					self.execute("sudo -S sliver-ovs del_bridge "+device_i.id_dev, sshHost, display=True)
				self.execute("sudo -S sliver-ovs stop_switch", sshHost, display=True)
				self.execute("sudo -S sliver-ovs stop_db", sshHost, display=True)
				host_i.services.removeService()
				
	def printSlice(self):
		print "List of slice/host/interface"
		for slice_i in self.__sliceList__:
			print slice_i
			for host_i in slice_i.hosts:
				print "\t"+str(host_i)
				for dev_i in host_i.devices:
					print "\t\t"+str(dev_i)
	
	def printLink(self):
		print "\nList of link"
		for link_i in self.__linkList__:
			print link_i
	
	def printRoute(self):
		print "\nList of additionnal route"
		for slice_i in self.__sliceList__:
			for host_i in slice_i.hosts:
				for route_i in host_i.routes:
					print route_i
	
	def printService(self):
		print "\nList of deployed service"
		for slice_i in self.__sliceList__:
			for host_i in slice_i.hosts:
				serviceStr = str(host_i.services)
				if serviceStr != '':
					print host_i.services
	
	def getSliceList(self):
		return self.__sliceList__

	@classmethod
	def helpOption(self):
		print "You can use the following options:"
		print "\t setTopology : to create the topology"
		print "\t clearTopology : to clear the topology"
		print "\t printTopology : to print the topology"
		print "Optionnal:"
		print "\t $2 : configuration xml file"
		print "\t $3 : link xml file"
		print "\t $2 : prefix to find the xml file"
		print "\t If not given default are Conf.xml, Link.xml"

def keyFile(x):
	print x
	if not os.path.exists(x) and x!=os.path.expanduser('~/.ssh/id_rsa'):
		raise argparse.ArgumentError("{0} does not exist".format(x))
	return x

if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	#parser = argparse.ArgumentParser("This script allow you to deploy a configured topology on planetlab node, the topology has to be descript in xml file\nYou have to use one of the action option (-c -s -p)\nYou have to specify the input file that need to be used")
	parser.add_argument("action", help="The action you want to perform choices are print, set or clear the topology", choices = ['print','set','clear'], default='print', nargs='?')
	parser.add_argument("-k", "--key", help="The location of the ssh private key file (default value is ~/.ssh/id_rsa)", default=os.path.expanduser('~/.ssh/id_rsa'), type=keyFile)
	parser.add_argument('-p', '--port', help='The port used for the ssh connection (default is 22)', default=22, type = int)

	groupInput = parser.add_mutually_exclusive_group()
	groupInput.add_argument("-f", "--file", help="The xml file that will be used, Link xml file then Configuration xml file", type=str, default='', nargs=2)
	groupInput.add_argument("-d", "--directory", help="The directory used to find the xml file the script will look at prefix+Conf.xml and prefix+Link.xml", type=str, default='./', dest='prefix')

	try:
		args = parser.parse_args()
	except Exception, why:
		print "An error occured while parsing the argument"
		parser.print_help()
		print why
		sys.exit(2)

	if args.file != '':
		x = TransformXml(confFile = args.file[0], linkFile = args.file[1], port = args.port, keyFile = args.key)
	else:
		x = TransformXml(prefix = args.prefix, port = args.port, keyFile = args.key )

	if args.action == "set" :
		x.setSliceConf()
		x.setLinks()
		x.setRoutes()
		x.setServices()
	elif args.action == "clear" :
		x.clearConf()
	elif args.action == "print" :
		x.printSlice()
		x.printLink()
		x.printRoute()
		x.printService()
		
