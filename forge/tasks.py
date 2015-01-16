# -*- coding:utf-8 -*-
from django.core.files import File
from celery import task, current_task
from djcelery.models import TaskState
from xmlrpclib import Fault

from forge.models import *

import forge.script.Auth as Auth
import time

# Import class used to create the environment
from forge.script.request import TransformRawXml
from forge.script.openvswitch import TransformXml

# Import the settings
from django.conf import settings

@task()
def taskInstallEnvironment(env):
	env.ready = False
	env.save()
	#TODO Change directory location
	curDir = os.getcwd()
	os.chdir('./ict_education/script/')
	try:
		xml = TransformXml(confFile = curDir+env.confFile.url, linkFile = curDir+env.linkFile.url, keyFile = curDir+env.course.mainKey.url)
		xml.clearConf()
		xml.setSliceConf()
		xml.setLinks()
		xml.setRoutes()
		xml.setServices()
	except Exception, why:
		print why
	os.chdir(curDir)
	env.ready = True
	env.save()

@task()
def taskDeleteCourse(course):
	environments = course.environment_set.all()
	#TODO Change directory location
	curDir = os.getcwd()
	os.chdir('./ict_education/script/')
	for env in environments:
		try:
			xml = TransformXml(confFile = curDir+env.confFile.url, linkFile = curDir+env.linkFile.url, keyFile = curDir+env.course.mainKey.url)
			xml.clearConf()
		except Exception, why:
			print why
	try:
		rawXml = TransformRawXml(sliceName=course.sliceName)
		rawXml.deleteSlice()
	except Fault, why:
		print "I got an xmlrpc Fault"
		print why
	os.chdir(curDir)
	course.delete()

@task()
def taskRenewSlice(course):
	rawXml = TransformRawXml(sliceName=course.sliceName)
	rawXml.renewSlice()

@task()
def taskCreateCourse(form):
	newCourse = Course()
	newCourse.lab = Lab.objects.get(id=form.cleaned_data['lab'].id)
	newCourse.ready = False
	newCourse.sliceName = form.cleaned_data['sliceName']
	newCourse.save()
	#TODO Change directory location
	curDir = os.getcwd()
	os.chdir('./ict_education/script/')
	if form.cleaned_data['keyLocation'] == '':
		keyLocation = None
	else:
		keyLocation = form.cleaned_data['keyLocation']
	if form.cleaned_data['url'] == '':
		sliceUrl = 'http://onelab.eu'
	else:
		sliceUrl = form.cleaned_data['url']
	if form.cleaned_data['description'] == '':
		sliceDescription = 'Slice used for educational purpose'
	else:
		sliceDescription = form.cleaned_data['url']
	try:
		rawXml = TransformRawXml(confFile = settings.MEDIA_ROOT+newCourse.lab.configurationFile.name, linkFile = settings.MEDIA_ROOT+newCourse.lab.linkFile.name, subnet = form.cleaned_data['subnet'], sliceName = form.cleaned_data['sliceName'], nbEnv = form.cleaned_data['nbEnv'], sliceUrl = sliceUrl, sliceDescription = sliceDescription, mainKeyPriv = keyLocation)
		rawXml.setSlice()
		newCourse.mainKey.save(rawXml.mainKeyPriv.split('/')[-1], File(open(rawXml.mainKeyPriv)))
		newCourse.save()
		i = 0
		for environment in rawXml.envList:
			newEnv = Environment()
			newEnv.ready = False
			newEnv.course = newCourse
			newEnv.sshKey.save(rawXml.envKeyPriv[i].split('/')[-1], File(open(rawXml.envKeyPriv[i])))
			newEnv.confFile.save(rawXml.envConfFile[i].split('/')[-1], File(open(rawXml.envConfFile[i])))
			newEnv.linkFile.save(rawXml.envLinkFile[i].split('/')[-1], File(open(rawXml.envLinkFile[i])))
			newEnv.save()
			i += 1
			for plSlice in environment:
				newSlice = Slice()
				newSlice.sliceName = plSlice.slice_name
				newSlice.environment = newEnv
				newSlice.save()
				for host in plSlice.hosts:
					newHost = Host()
					nodeSelected = ''
					for env in rawXml.nodeList:
						for node in env:
							if node['hostname'] == host.url:
								nodeselected = node
								break
						if nodeSelected != '':
							break
					newHost.hostname = host.url
					newHost.pleSlice = newSlice
					newHost.latitude = nodeSelected['latitude']
					newHost.longitude = nodeSelected['longitude']
					newHost.save()
					for serviceName, port in host.services.services:
						newService = Service()
						newService.serviceName = serviceName
						newService.servicePort = str(port)
						newService.host = newHost
						newService.save()
					for device in host.devices:
						newInterface = Interface()
						newInterface.ip = device.ip
						newInterface.name = device.id_dev
						newInterface.host = newHost
						newInterface.save()
			newEnv.ready = True
			newEnv.save()
		os.chdir(curDir)
		newCourse.ready = True
		newCourse.save()
	except Exception, why:
		print "An error occured deleting the environment"
		print why
		rawXml = TransformRawXml(sliceName=newCourse.sliceName)
		rawXml.deleteSlice()
		raise Exception('Global Fault')
	return 0
