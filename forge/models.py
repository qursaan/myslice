# -*- coding:utf-8 -*-

from django.db import models

# Used for automatically delete file
from django.dispatch import receiver
import os

# Class to describe a service set on a host
class Service(models.Model):
	serviceName = models.CharField(max_length=50)
	servicePort = models.CharField(max_length=10)
	host = models.ForeignKey('Host')

	def __unicode__(self):
		if self.servicePort != u'':
			return u"%s on %s" % (self.serviceName, self.servicePort)
		else:
			return u"%s" % self.serviceName

# Class to describe an interface available on a host
class Interface(models.Model):
	ip = models.CharField(max_length=16)
	name = models.CharField(max_length=40)
	host = models.ForeignKey('Host')

	def __unicode__(self):
		return u"%s -> %s" % (self.name, self.ip)

# Class to describe a host
class Host(models.Model):
	TYPE_CHOICES = (
		('PUB', 'Public'),
		('PRIV', 'Private'),
		('COM', 'Common'),
	)
	hostname = models.CharField(max_length=100)
	hostType = models.CharField(max_length=20, choices=TYPE_CHOICES, default='PRIV')
	pleSlice = models.ForeignKey('Slice')
	latitude = models.FloatField()
	longitude = models.FloatField()

	def __unicode__(self):
		return u"%s %s" % (self.hostname, self.hostType)

# Class to describe a slice (sliceName and reference to environment)
class Slice(models.Model):
	sliceName = models.CharField(max_length=50)
	environment = models.ForeignKey('Environment')

	def __unicode__(self):
		return u"%s" % self.sliceName

# Class to describe a student environment (sshKey and reference to a course)
class Environment(models.Model):
	sshKey = models.FileField(upload_to='ict_education/keys')
	course = models.ForeignKey('Course')
	confFile = models.FileField(upload_to='ict_education/xmlFiles')
	linkFile = models.FileField(upload_to='ict_education/xmlFiles')
	ready = models.BooleanField(default=False)

# function used to automatically delete the stored file when deleting the model from the database
@receiver(models.signals.post_delete, sender = Environment)
def environment_delete_ssh_key(sender, instance, **kwargs):
	if instance.sshKey:
		if os.path.isfile(instance.sshKey.path):
			os.remove(instance.sshKey.path)
	if instance.confFile:
		if os.path.isfile(instance.confFile.path):
			os.remove(instance.confFile.path)
	if instance.linkFile:
		if os.path.isfile(instance.linkFile.path):
			os.remove(instance.linkFile.path)

# Class to describe a course (ie a set of environment) (reference to lab, mainKey used by the teacher to access all node)
class Course(models.Model):
	lab = models.ForeignKey('Lab')
	mainKey = models.FileField(upload_to='ict_education/keys', null = True)
	ready = models.BooleanField(default=False)
	sliceName = models.CharField(max_length=50)
	
	def __unicode__(self):
		return u"%s %s" % (self.lab, self.sliceName)

# function used to automatically delete the stored file when deleting the model from the database
@receiver(models.signals.post_delete, sender = Course)
def course_delete_main_ssh_key(sender, instance, **kwargs):
	if instance.mainKey:
		if os.path.isfile(instance.mainKey.path):
			os.remove(instance.mainKey.path)

# Class to describe a lab
class Lab(models.Model):
	title = models.CharField(max_length=100)
	author = models.CharField(max_length=40)
	subject = models.FileField(upload_to='ict_education/Labs/subjects')
	configurationFile = models.FileField(upload_to='ict_education/Labs/xmlFiles')
	linkFile = models.FileField(upload_to='ict_education/Labs/xmlFiles')

	def __unicode__(self):
		return u"%s %s" % (self.title, self.author)

# function used to automatically delete the stored file when deleting the model from the database
@receiver(models.signals.post_delete, sender = Lab)
def lab_delete_files(sender, instance, **kwargs):
	# Remove the subject
	if instance.subject:
		if os.path.isfile(instance.subject.path):
			os.remove(instance.subject.path)
	# Remove the configuration file
	if instance.configurationFile:
		if os.path.isfile(instance.configurationFile.path):
			os.remove(instance.configurationFile.path)
	# Remove the link file
	if instance.linkFile:
		if os.path.isfile(instance.linkFile.path):
			os.remove(instance.linkFile.path)

