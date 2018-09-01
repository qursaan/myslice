#!/usr/bin/python

class FailToConnect(Exception):
	def __init__(self, nodeId, nodeUrl):
		self.nodeId = nodeId
		self.nodeUrl = nodeUrl
	def __str__(self):
		return repr(self.siteId)
	def getNodeId(self):
		return self.nodeId
	def getNodeUrl(self):
		return self.nodeUrl

class SSHConnectError(Exception):
	def __init__(self, host, sliceName):
		self.why = "Can't connect to the node "+str(sliceName)+"@"+str(host)
	
	def __str__(self):
	 return repr(self.why)

class NodeConstraintError(Exception):
	def __init__(self, constraint, envList):
		self.why = "Can't find node with constraint : "+str(constraint)
		self.envList = envList

	def getEnvList(self):
		return self.envList
