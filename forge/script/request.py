#!/usr/bin/python

import xmlrpclib
import Auth
import sys
import paramiko
import subprocess
import time
import geopy
import geopy.distance
import argparse
import os
import socket
import urllib2
import csv
from openvswitch import TransformXml
from exceptionDefinition import FailToConnect, NodeConstraintError
from scp import SCPClient


yumOpt =  "sudo -S yum -y --nogpgcheck "

class TransformRawXml:
	def __init__(self, confFile = "", linkFile = "", subnet = "", prefix = "", sliceName = "", nbEnv = 1, mainKeyPriv = None, mainKeyPub = None, sliceUrl = 'http://onelab.eu', sliceDescription = 'Slice used for educationnal purpose', country = False):
		# Definition of the api used for the actions on planetlab
		plc_host='www.planet-lab.eu'
		api_url='https://%s:443/PLCAPI/'%plc_host
		self.plc_api=xmlrpclib.ServerProxy(api_url, allow_none=True)
		# Prefix used for the slice name
		slice_pref='upmc_'

		self.sliceUrl = sliceUrl
		self.sliceDescription = sliceDescription

		myOpsPLC = urllib2.urlopen('http://monitor.planet-lab.org/monitor/query?hostname=on&tg_format=plain&object=nodes&nodehistory_hostname=&observed_status=on&rpmvalue=')
		self.myOpsPLCCsv = list(csv.reader(myOpsPLC))
		myOpsPLE = urllib2.urlopen('http://monitor.planet-lab.eu/monitor/query?hostname=on&tg_format=plain&object=nodes&nodehistory_hostname=&observed_status=on&rpmvalue=')
		self.myOpsPLECsv = list(csv.reader(myOpsPLE))

		self.subnet = subnet
		if prefix != "":
			self.xmlFileConf = prefix+'Conf.xml'
			self.xmlFileLink = prefix+'Link.xml'
		else:
			self.xmlFileConf = confFile
			self.xmlFileLink = linkFile
		if 'upmc_' not in sliceName:
			self.slice_name = slice_pref+sliceName
		else:
			self.slice_name = sliceName

		self.nbEnv = int(nbEnv)
		
		self.country = country

		# Attribute for ssh key
		self.mainKeyPriv = mainKeyPriv
		self.mainKeyPub = mainKeyPub
		self.envKeyPriv = []
		self.envKeyPub = []

		# Attribute that will contain the list of environment
		self.envList = []

		self.envConfFile = []
		self.envLinkFile = []
		
	# Delete the slice
	def deleteSlice(self):
		errorCode = self.plc_api.DeleteSlice(Auth.auth, self.slice_name)
		if errorCode != 1:
			print "An error occured unable to delete the slice"
			print errorCode
			print self.slice_name

	# Add 15 days to the expiration date
	def renewSlice(self, day = 15):
		print self.slice_name
		expiration = self.plc_api.GetSlices(Auth.auth, self.slice_name, ['expires'])[0]['expires']
		print expiration
		newExpiration = expiration + (3600*24*day)
		self.plc_api.UpdateSlice(Auth.auth, self.slice_name, {'expires': newExpiration})
		expiration = self.plc_api.GetSlices(Auth.auth, self.slice_name, ['expires'])[0]['expires']
		print expiration

	# Generate a ssh key pair
	def generateKeyPair(self,pref = "", bit = 1024):
		key = paramiko.RSAKey.generate(bit)
		# Save the private key file
		keyFilePriv = pref+"id_rsa.priv"
		key.write_private_key_file(keyFilePriv)
		# Save the public key file
		keyFilePub = pref+"id_rsa.pub"
		openedFile = open(keyFilePub, 'w')
		openedFile.write("%s %s \n" % (key.get_name(), key.get_base64()))
		return keyFilePriv, keyFilePub

	# press any key to continue function
	def anykey(self, prompt="Press enter to continue...", failChars=""):
		char = raw_input(prompt)
		return (char not in failChars)

	def checkSSH(self, node):
		countFailSSH = 9
		ssh = paramiko.SSHClient()
		ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
		connected = False
		error = None
		i = 0
		while(connected == False):
			print "\n"+self.mainKeyPriv+" -> "+self.slice_name+"@"+node['hostname']
			try:
				ssh.connect(node['hostname'], username = self.slice_name, key_filename = self.mainKeyPriv)
				connected = True
			except paramiko.PasswordRequiredException, why:
				print "Password required exception"
				print "Error: ", why

			except paramiko.SSHException, why:
				print "An SSH exception occured"
				print "Error: ", why

			except socket.error, why:
				print "A soccket error occured"
				print why
				failingNode = self.plc_api.GetNodes(Auth.auth, node['id'])[0]
				print 'FailingNode node_id -> '+str(failingNode['node_id'])
				raise FailToConnect(failingNode['node_id'], failingNode['hostname'])

			except Exception, why:
				print "An error occured for host "+str(node['hostname'])+" on slice "+str(self.slice_name)
				print type(why)
				print why
				sys.exit(2)
				if str(why)!=error:
					print why
					error=str(why)

			if i > countFailSSH and connected==False:
				print error
				failingNode = self.plc_api.GetNodes(Auth.auth, node['id'])[0]
				raise Exception(failingNode['hostname'])
			try:
				if connected == False:
					print "Now waiting 5 minutes for an update of the node"
					time.sleep(300)
			except KeyboardInterrupt, why:
				print "You interrupt the wait"
			i += 1
		print "I make",i,"iteration before getting connection"
		copied = False
		i=0
		while(copied == False):
			try:
				SCPClient(ssh.get_transport()).put('configService/fedora.repo')
				SCPClient(ssh.get_transport()).put('configService/fedora-updates.repo')
				SCPClient(ssh.get_transport()).put('configService/fedora-updates-testing.repo')
				self.execute("sudo -S mv *.repo /etc/yum.repos.d/", ssh)
				self.execute("sudo -S chown root:root /etc/yum.repos.d/*.repo", ssh)
				copied = True
			except Exception, why:
				print "An error occured while configuring yum"
				print "Error: ",why
				if i > 4 and copied == False:
					failingNode = self.plc_api.GetNodes(Auth.auth, node['id'])[0]
					raise Exception(failingNode['hostname'])
			if copied == False:
				time.sleep(60)
			i+=1

		return ssh


	# Install an alternate ssh server
	def installSSH(self, userKeyFile, node):
		ssh = self.checkSSH(node)
		returnCode = -1
		i = 0
		while(returnCode != 0):
			if i > 3:
				failingNode = self.plc_api.GetNodes(Auth.auth, node['id'])[0]
				raise Exception(failingNode['hostname'])
			returnCode = self.execute(yumOpt+"install openssh-server", ssh, display= True)
			print "Return Code is ->", returnCode
			time.sleep(5)
			i += 1
		self.execute("mkdir .ssh", ssh, display= True)
		if node['type'] == 'private':
			SCPClient(ssh.get_transport()).put(userKeyFile, ".ssh/id_rsa.pub")
			SCPClient(ssh.get_transport()).put("configService/sshd_config", "./")
		elif node['type'] == 'public':
			SCPClient(ssh.get_transport()).put(userKeyFile, ".ssh/id_rsa.pub.tmp")
			SCPClient(ssh.get_transport()).put("configService/sshd_config", "./")
			self.execute("cat .ssh/id_rsa.pub.tmp >> .ssh/id_rsa.pub", ssh)
		self.execute("sudo -S mv ./sshd_config /etc/ssh/", ssh)
		self.execute("sudo -S sh -c \"echo \\\"Port 2222\\\" >> /etc/ssh/sshd_config\"", ssh)
		port = 2222
		returnCode = -1
		while (returnCode != 0):
			time.sleep(2)
			returnCode = self.execute("sudo -S service sshd restart", ssh, display = True)
			if returnCode != 0:
				self.execute("sudo -S sed -i -e \"s/Port "+str(port)+"/Port "+str(port+1)+"/g\" /etc/ssh/sshd_config", ssh)
				port +=1
		return port

	# Execute a command on a remote machine
	def execute(self, command, ssh, display= False, retour= False):
		print "# "+command
		stdin, stdout, stderr = ssh.exec_command(command)
		stdin.close()
		while not stdout.channel.exit_status_ready():
			time.sleep(2)
	
		err = stderr.read()
		if err != None:
			splitted = err.splitlines()
			if len(splitted) > 0:
				print "Error in execution"
				for line in splitted:
					print "> "+line
		if display:
			for line in stdout.read().splitlines():
				print "> "+line
		elif retour:
			return stdout.read()
		return stdout.channel.recv_exit_status()

	# Create the xml file corresponding to each environment
	def createXmlFile(self, hostList, idEnv):
		from xml.dom.minidom import parse
		conf = parse(self.xmlFileConf)
		link = parse(self.xmlFileLink)
		sliceNames = link.getElementsByTagName('slice')
		for value in sliceNames:
			value.firstChild.nodeValue = self.slice_name
		sliceNames = conf.getElementsByTagName('slice_name')
		for value in sliceNames:
			value.firstChild.nodeValue = self.slice_name
		urlList = conf.getElementsByTagName('url')
		if len(hostList) < len(urlList):
			print "hostlist -> "+str(len(hostList))
			print "urllist -> "+str(len(urlList))
			for host in hostList:
				print host
		for i in range(len(urlList)):
			urlList[i].firstChild.nodeValue = hostList[i]
		subnetIP, subnetMask = self.subnet.split('/')
		subnetMask = int(subnetMask)
		subnetIP = subnetIP.split('.')
		ipList = conf.getElementsByTagName('ip')
		for ipWithMask in ipList:
			ip, mask = str(ipWithMask.firstChild.nodeValue).split('/')
			ip = ip.split('.')
			mask = int(mask)
			newIP = ''
			if subnetMask > mask:
				sys.exit(2)
				# TODO define SubnetException
				pass
				#raise SubnetException()
			else:
				subnetRange = subnetMask/8
				for i in range(len(ip)):
					if i < subnetRange:
						newIP+=subnetIP[i]
					else:
						if ip[i] == 'N':
							newIP+=str(idEnv)
						else:
							newIP+=ip[i]
					if i < 3:
						newIP+='.'
				newIP+='/'+str(mask)
			ipWithMask.firstChild.nodeValue = newIP
		confFileName = 'requ'+str(idEnv)+'Conf.xml'
		confFile = open(confFileName, 'w')
		conf.writexml(confFile)
		confFile.close()
		self.envConfFile.append(confFileName)
		linkFileName = 'requ'+str(idEnv)+'Link.xml'
		linkFile = open(linkFileName, 'w')
		link.writexml(linkFile)
		linkFile.close()
		self.envLinkFile.append(linkFileName)

	def getNodeAvailable(self, site, nodeUsed = []):
		nodes = self.plc_api.GetNodes(Auth.auth, site['node_ids'])
		if site['peer_id'] == 1:
			myOpsCsv = self.myOpsPLCCsv
		else:
			myOpsCsv = self.myOpsPLECsv
		for node in nodes:
			for row in myOpsCsv:
				if node['hostname'] == row[0]:
					node['myOpsStatus'] = row[1]
					break
		nodeAvailable = []
		for node in nodes:
			if (node['myOpsStatus'] == 'BOOT' and node['boot_state'] == 'boot' and node['run_level'] == 'boot' and node['node_id'] not in nodeUsed):
				nodeAvailable.append(node)
		return nodeAvailable

	def getEnvironmentWithCountryConstraint(self, countryListPrivate, contryListCommon, sites, siteBanned):
		print "Now looking for the environment using the country constraint"
		sitesTmp = []
		for site in sites:
			if len(site['address_ids']) == 1:
				sitesTmp.append(site)
		sites = sitesTmp
		sitesEnv = sitesCommon = []
	
		# Getting the private allowed address
		try:
			privateAddrAuth = structToArray(self.plc_api.GetAddresses(Auth.auth, {'country': countryListPrivate}, ['address_id']), 'address_id')
		except Exception, why:
			print why
			sys.exit(2)

		privateAddresses = []
		i = 0
		for site in sites:
			if site['address_ids'][0] in privateAddrAuth and i < self.nbEnv:
				privateAddresses.append(site['address_ids'][0])
				i += 1
		# Getting the private Node
		print "Getting the private node matching with the requirement"
		i = 0
		for site in sites:
			if len(site['address_ids']) == 1 and site['address_ids'][0] in privateAddrAuth:
				nodeEnv = []
				if i < self.nbEnv:
					j = 0
					nodeSite = self.plc_api.GetNodes(Auth.auth, site['node_ids'], ['hostname', 'run_level', 'node_id', 'boot_state', 'hostname'])
					for node in nodeSite:
						if i < self.nbEnv:
							if node['boot_state'] == 'boot':
								j+=1
								nodeEnv.append({'type': 'private', 'id': node['node_id'], 'hostname': node['hostname']})
							if j>=nbNodeByEnv:
								i += 1
								nodeStructList.append(nodeEnv)
								sitesEnv.append(site)
								nodeIdList = structToArray(nodeEnv, 'id')
								nodeEnv = []
								j = 0
	
		print nodeIdList
		print "List of site for environment :"
		if len(nodeStructList) < self.nbEnv:
			print "Error we are not able to find enough environment"
			sys.exit(2)
		for site in sitesEnv:
			print "\t"+str(site)
	
		# Getting the addresse wanted for common node
		commonAddresses = []
		for country in countryListCommon:
			address = self.plc_api.GetAddresses(Auth.auth, {'country': country}, ['address_id'])[0]['address_id']
			if address not in privateAddresses:
				commonAddresses.append(address)

		# Getting the common node
		commonNodes = []
		for site in sites:
			if site['address_ids'][0] in commonAddresses:
				nodeSite = self.plc_api.GetNodes(Auth.auth, site['node_ids'], ['hostname', 'run_level', 'node_id', 'boot_state'])
				for node in nodeSite:
					if node['boot_state'] == 'boot' and node['node_id'] not in nodeIdList:
						commonNodes.append({'type': 'common','id': node['node_id'], 'hostname': node['hostname']})
						nodeIdList.append(node['node_id'])
						break
	
		for env in nodeStructList:
			for node in commonNodes:
				env.append(node)


		print "Address list :"
		#for addresse in commonAddresses:
		#	print "\t"+str(addresse)
		print privateAddresses
		print commonAddresses

		return nodeStructList

	def getEnvironmentWithDistanceConstraint(self, constraintList, sitesList, siteBanned, nodeBanned):
		print "Now looking for the environment using the distance constraint"
		envList = []
		nbPrivate = nbCommon = 0
		nbInitPrivate = nbInitCommon = 0
		# Counting the number of private and common node
		# Also counting the number of node located at the same point
		for node in constraintList:
			if node['type'] == 'private':
				nbPrivate += 1
				if node['max'] == 0 and node['min'] == 0:
					nbInitPrivate += 1
			elif node['type'] == 'common' or node['type'] == 'public':
				nbCommon += 1
				if node['max'] == 0 and node['min'] == 0:
					nbInitCommon += 1
	
		print "Common "+str(nbCommon)+" "+str(nbInitCommon), " Private "+str(nbPrivate)+" "+str(nbInitPrivate)
		nbReservedEnvironment = 0
		siteUsed = []
		nodePrivate = []
		nodeShared = []
		while nbReservedEnvironment < self.nbEnv:
			tmpListEnv = []
			maxNode = []
			for site in sitesList:
				if site['site_id'] not in siteUsed and site['site_id'] not in siteBanned:
					try:
						nodeAvailable = self.getNodeAvailable(site, nodeBanned)
						if len(nodeAvailable) > len(maxNode):
							maxNode = nodeAvailable
							siteInit = site
					except Exception, why:
						print 'Couldn\'t get the node available'
						print site['name']
						print why
						sys.exit(2)
			siteUsed.append(siteInit['site_id'])
			newEnv = []
			print "Site used -> "+str(siteUsed)
			print siteInit['name']
			for i in range(len(maxNode)-nbInitCommon):
				node = maxNode[i]
				if nbReservedEnvironment < self.nbEnv:
					newEnv.append({'type': 'private', 'id': node['node_id'], 'hostname': node['hostname'], 'distance': 0, 'latitude': siteInit['latitude'], 'longitude': siteInit['longitude']})
					nodePrivate.append(node['node_id'])
					if len(newEnv) == nbInitPrivate:
						tmpListEnv.append(newEnv)
						newEnv = []
						nbReservedEnvironment += 1
				else:
					break
			commonNode = []
			for i in range(nbInitPrivate,len(constraintList)):
				nodeAdded = False
				print constraintList[i]
				if constraintList[i]['type'] in ['common', 'public']:
					for site in sitesList:
						if site['site_id'] not in siteBanned:
							initPoint = geopy.Point(siteInit['latitude'], siteInit['longitude'])
							distPoint = geopy.Point(site['latitude'], site['longitude'])
							distance = geopy.distance.distance(initPoint, distPoint).km
							if distance >= constraintList[i]['min'] and distance <= constraintList[i]['max']:
								nodeAvailable = self.getNodeAvailable(site, nodePrivate+nodeBanned)
								if len(nodeAvailable) > 0:
									print distance
									print site['name']
									siteUsed.append(site['site_id'])
									node = nodeAvailable[0]
									nodeShared.append(node['node_id'])
									commonNode.append({'type': constraintList[i]['type'], 'id': node['node_id'], 'hostname': node['hostname'], 'distance': int(distance), 'latitude': site['latitude'], 'longitude': site['longitude']})
									nodeAdded = True
									break
					if not(nodeAdded) and constraintList[i]['type'] in ['common', 'public']:
						print 'Error no node added for constraint -> '+str(constraintList[i])
						raise NodeConstraintError(constraintList[i], envList)
				elif constraintList[i]['type'] == 'private':
					nodeToAdd = []
					for env in tmpListEnv:
						if len(nodeToAdd) == 0:
							for site in sitesList:
								if site['site_id'] not in siteBanned:
									initPoint = geopy.Point(siteInit['latitude'], siteInit['longitude'])
									distPoint = geopy.Point(site['latitude'], site['longitude'])
									distance = geopy.distance.distance(initPoint, distPoint).km
									if distance >= constraintList[i]['min'] and distance <= constraintList[i]['max']:
										nodeAvailable = self.getNodeAvailable(site, nodePrivate+nodeShared+nodeBanned)
										if len(nodeAvailable) > 0:
											nodeToAdd = nodeAvailable
						node = nodeToAdd.pop(0)
						env.append({'type': 'private', 'id': node['node_id'], 'hostname': node['hostname'], 'distance': int(distance), 'latitude': site['latitude'], 'longitude': site['longitude']})

			for env in tmpListEnv:
				for node in commonNode:
					env.append(node)
					
			envList.extend(tmpListEnv)
	
		return envList

	# Reading the raw xml file to get information
	# Return an array of array of struct containing the information concerning each environment requested
	def readRawXml(self, siteBanned, nodeBanned):
		print "Banned Site ->",siteBanned
		print "Node banned ->",nodeBanned
		from xml.dom.minidom import parse
		conf = parse(self.xmlFileConf)
		nbNodeByEnv = nbCommonNode = 0
		nodeStructList = []
		nodeIdList = []
		countryListCommon = []
		countryListPrivate = []
		constraintList = []
		for host_i in conf.getElementsByTagName('host'):
			hostType = ""
			try:
				hostType = host_i.getElementsByTagName('type')[0].firstChild.nodeValue
			except Exception, why:
				print why
			if hostType == 'private' or hostType == "":
				nbNodeByEnv += 1
			elif hostType == 'common' or hostType == 'public':
				nbCommonNode += 1
			else:
				print "Error the host type "+hostType+" doesn't exist"
				sys.exit(2)
			if self.country:
				try:
					hostCountry = host_i.getElementsByTagName('country')[0].firstChild.nodeValue
					if hostType == 'common':
						countryListCommon.append(hostCountry)
					elif hostType == 'private':
						countryListPrivate.append(hostCountry)
				except Exception, why:
					print "An error occured"
					print why
					sys.exit(2)
			else:
				try:
					distance = host_i.getElementsByTagName('distances')[0]
					distMin = int(distance.getElementsByTagName('min')[0].firstChild.nodeValue)
					distMax = int(distance.getElementsByTagName('max')[0].firstChild.nodeValue)
					constraintList.append({'type': hostType, 'min': distMin, 'max': distMax})
				except Exception, why:
					print "An error occured"
					print why
					sys.exit(2)


		print "Getting all the site available"
		sites = self.plc_api.GetSites(Auth.auth, ['*'])
	
		if self.country:
			nodeStructList = self.getEnvironmentWithCountryConstraint(countryListPrivate, contryListCommon, sites, siteBanned, nodeBanned)
		else:
			try:
				nodeStructList = self.getEnvironmentWithDistanceConstraint(constraintList, sites, siteBanned, nodeBanned)
			except NodeConstraintError as error:
				self.nbEnv = len(error.getEnvList())
				nodeStructList = error.getEnvList()
	

		# Creating a file containing all the information about the slice created
		origStdout = sys.stdout
		sys.stdout = open('Test', 'w')
		i = 0
		print "Slice name : "+self.slice_name
		for env in nodeStructList:
			i+=1
			print "\tEnv %i"%i
			for node in env:
				strNode = '\t'
				for key in node.keys():
					strNode += "\t"+str(key)+" : "+str(node[key])
				print strNode
		sys.stdout.close()
		sys.stdout = origStdout
	
		return(nodeStructList)

	def structToArray(self, requestAnswer, key):
		#return  [i[key] for i in requestAnswer]
		array = []
		for i in requestAnswer:
			array.append(i[key])
		return array

	def addSliceTag(self, sliceId, tagName, tagValue):
		try:
			returnCode = self.plc_api.AddSliceTag(Auth.auth, sliceId, tagName, tagValue)
			if returnCode == 0:
				print "An error Occured while adding the tag %s -> %s"% tagName, tagValue
		except xmlrpclib.Fault as fault:
			if fault.faultCode != 102:
				print "An error occured"
				print fault
				sys.exit(2)

	def getSlice(self):
		try:
			sliceId = self.plc_api.GetSlices(Auth.auth, self.slice_name)[0]['slice_id']
		except xmlrpclib.Fault, why:
			print "An error while getting the slice already existing"
			print why
			sys.exit(2)
		return sliceId
	
	def createSlice(self):
		sliceId = 0
		print "Creating a new slice called : "+self.slice_name
		try:
			sliceId = self.plc_api.AddSlice(Auth.auth, {'description': self.sliceDescription, 'name':self.slice_name, 'url': self.sliceUrl})
		except xmlrpclib.Fault, why:
			print "An error occured while creating the slice "+self.slice_name
			print why
		except Exception, why:
			print "An error occured while createing the slice "+self.slice_name
			print type(why)
			print why
		return sliceId
	
	def setSlice(self):
		sliceId = self.createSlice()
		if (sliceId == 0):
			print 'Slice exist'
			sliceId = self.getSlice()
		print "Adding user to the slice"
		returnCode = self.plc_api.AddPersonToSlice(Auth.auth, Auth.auth['Username'], sliceId)
		
		if type(self.nbEnv) != int:
			print "You must enter a number"
			sys.exit(2)

		print "Generating and adding the main ssh key"
		print os.getcwd()
		if self.mainKeyPriv == None:
			self.mainKeyPriv, self.mainKeyPub = self.generateKeyPair(pref = "./key/"+self.slice_name+"main", bit = 1024)
		f = open(self.mainKeyPub)
		keyString = f.read()
		try:
			keyId = self.plc_api.AddPersonKey(Auth.auth, Auth.auth['Username'], {'key_type': 'ssh', 'key': keyString})
			if returnCode == 0:
				print "An error occured while adding the key to the user"
				sys.exit(2)
		except xmlrpclib.Fault as fault:
			print fault
			sys.exit(2)

		success = False
		#TODO Ban failing site, waiting for fix
		#FU Berlin || Reykjavik University || FOKUS || University of Goettingen
		siteBanned = [7341, 7336, 443, 7059]
		# TODO banned new lip6 node + FUNDP Site + DSCHINI
		nodeBanned = [15953, 15954, 15955, 15956, 14810]
		while success == False:
			nodeList = self.readRawXml(siteBanned[:], nodeBanned)
		
			print "Adding node to the slice"
			i = 0
			for env in nodeList:
				for node in env:
					failToAdd = True
					j = 0
					while failToAdd:
						try:
							if node['type'] == 'private' or ((node['type'] == 'common' or node['type'] == 'public') and i == 0):
								returnCode = self.plc_api.AddSliceToNodes(Auth.auth, sliceId, [node['id']])
							if returnCode != 1:
								print "An error occured while adding a node to the slice"
								time.sleep(30)
							else:
								failToAdd = False
						except xmlrpclib.Fault as fault:
							print fault
							time.sleep(30)
						if j > 2 and failToAdd:
							raise FailToConnect(node['id'], node['hostname'])
						j+=1
				i = 1
	


			i=0
			# Set additional ssh server using generated key file and port 2222
			try:
				for envList in nodeList:
					envKeyPriv, envKeyPub = self.generateKeyPair(pref = "./key/"+self.slice_name+"group"+str(i+1), bit = 1024)
					self.envKeyPriv.append(envKeyPriv)
					self.envKeyPub.append(envKeyPub)
					for node in envList:
						print node['hostname']
						if node['type'] != 'common':
							self.installSSH(self.envKeyPub[i], node)
							pass
						else:
							self.checkSSH(node)
							pass
					i+=1
				success = True
			except FailToConnect as error:
				print "Not able to get the ssh connection for node", error.getNodeUrl()
				print 'Error node id -> '+str(error.getNodeId())
				print 'Before adding failing node -> '+str(nodeBanned)
				nodeBanned.append(error.getNodeId())
				print 'After adding failing node -> '+str(nodeBanned)
			except Exception, why:
				print "Not able to get the ssh connection", why



		print "Adding requested tag to the slice"
		# Adding the tag needed :
		#	- TAG -> VALUE : DEF
		#	- vsys -> vif_up 
		#	- vsys -> vif_down 
		#	- vsys -> fd_tuntap : Allow to create tun/tap interface
		#	- vsys -> vroute : Allow to define new route
		#	- vsys_vnet -> SUBNET : Define the subnet allowed for tun/tap device

		self.addSliceTag(sliceId, 'vsys', 'vif_up')
		self.addSliceTag(sliceId, 'vsys', 'vif_down')
		self.addSliceTag(sliceId, 'vsys', 'fd_tuntap')
		self.addSliceTag(sliceId, 'vsys', 'vroute')
		self.addSliceTag(sliceId, 'vsys_vnet', self.subnet)

		# Configuring the node using the openvswitch.py script
		# Command used to execute the script
		i = 0
		for env in nodeList:
			i+=1
			print "Env ",i
			hostnameList = self.structToArray(env, 'hostname')
			self.createXmlFile(hostnameList, i)
			try:
				x = None
				x = TransformXml(prefix = 'requ'+str(i), keyFile = self.mainKeyPriv)
				x.setSliceConf()
				x.setLinks()
				x.setRoutes()
				x.setServices()
				self.envList.append(x.getSliceList())
			except Exception, why:
				print "An error occured while configuring the environment number "+str(i-1)
				print Exception
				print ''
				print why
				sys.exit(2)

	
if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument("-s", "--subnet", help="The subnet reserved for the slice, it must include at least all the ip address used by the tp. The syntax is SUBNET/PREFIX (e.g 10.1.0.0/16 which is the default value)", default='10.1.0.0/16')
	parser.add_argument("-n", "--name", help="Name of the slice", default='tp')
	parser.add_argument("-nb", "--number", help="Number of the environment you want", type=int, default=1)
	groupInput = parser.add_mutually_exclusive_group()
	groupInput.add_argument('-f', '--file', help="The xml file that will be used, Link xml file then Configuration xml file", type=str, default='', nargs=2)
	groupInput.add_argument("-p", "--prefix", help="A prefix used to find the xml file, the script will look at prefix+Conf.xml and prefix+Link.xml", type=str, dest='prefix')

	try:
		args = parser.parse_args()
	except Exception, why:
		print "An error occured while parsing the argument"
		parser.print_help()
		print why
		sys.exit(2)
	
	if args.file != '':
		x = TransformRawXml(confFile = args.file[0], linkFile = args.file[1], subnet = args.subnet, sliceName = args.name, nbEnv = args.number)
		x.setSlice()
	else:
		x = TransformRawXml(prefix = args.prefix, subnet = args.subnet, sliceName = args.name, nbEnv = args.number)
		x.setSlice()

