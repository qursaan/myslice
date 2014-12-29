# -*- coding:utf-8 -*-
# Create your views here.

# Several import from the django facilities
from django.template import RequestContext
from django.shortcuts import render, get_object_or_404, render_to_response, redirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.core.files import File

# Import of the forms and models
from forge.models import *
from forge.forms import *

# Import of the task and TaskState (used to link task in the database)
from forge.tasks import *
from djcelery.models import TaskState

# Import the settings
from django.conf import settings

import os

# Import class used to create the environment
from forge.script.request import TransformRawXml

from myslice.theme import ThemeView
from unfold.loginrequired import FreeAccessView

class CreateCourseViev (FreeAccessView, ThemeView):
	template_name = 'create-course.html'

	def get (self, request, slicename, state=None):
		username = self.request.user
		split_slicename = slicename.split('.')
		ple_slicename = split_slicename[0] + '8' + split_slicename[1] + '_' + split_slicename[2]
		if not Course.objects.get(sliceName = ple_slicename).exists():
			if request.method == 'POST':
				form = courseForm(request.POST)
				if form.is_valid():
					result = taskCreateCourse.delay(form)
			else:
				labs = Lab.objects.all()
				form = courseForm()
		return render_to_response(self.template, { 'theme' : self.theme,'slicename':slicename, 'ple_slicename':ple_slicename, 'username':username, 'form': form }, context_instance=RequestContext(request))

def mainView(request):
	return render(request, 'mainView.html', locals())


def createLab(request):
	if request.method == 'POST':
		form = LabForm(request.POST, request.FILES)
		if form.is_valid():
			newLab = Lab(
				title = form['title'].value(),
				author = form['author'].value(),
				subject = request.FILES['subject'],
				configurationFile = request.FILES['configurationFile'],
				linkFile = request.FILES['linkFile'],
			)
			newLab.save()
	else:
		form = LabForm()
	labs = Lab.objects.all()
	return render_to_response('createLab.html', {'labs': labs, 'form':form}, context_instance=RequestContext(request))

def labDetails(request, id):
	try:
		lab = Lab.objects.get(id=id)
	except Lab.DoesNotExist:
		raise Http404
	return render(request, 'labDetails.html', locals())

def deleteLab(request, id):
	try:
		lab = Lab.objects.get(id=id)
	except Lab.DoesNotExist:
		raise Http404
	lab.delete()
	return redirect('forge.views.createLab')

def createCourse(request):
	if request.method == 'POST':
		form = courseForm(request.POST)
		if form.is_valid():
			result = taskCreateCourse.delay(form)
	else:
		labs = Lab.objects.all()
		form = courseForm()
	return render(request, 'createCourse.html', locals())

def installEnvironment(request, id):
	task = taskInstallEnvironment.delay(Environment.objects.get(id=id))
	return redirect('forge.views.listCourse')

def renewSlice(request, id):
	task = taskRenewSlice.delay(Course.objects.get(id=id))
	return redirect('forge.views.listCourse')

def deleteCourse(request, id):
	task = taskDeleteCourse.delay(Course.objects.get(id=id))
	return redirect('forge.views.listCourse')

def listCourse(request):
	courses = Course.objects.all()
	environments = Environment.objects.all()
	slices = Slice.objects.all()
	hosts = Host.objects.all()
	services = Service.objects.all()
	renderCourses = []
	for course in courses:
		renderEnvironment = []
		if course.ready:
			for environment in course.environment_set.all():
				renderSlice = []
				for pleSlice in environment.slice_set.all():
					renderHost = []
					for host in pleSlice.host_set.all():
						renderService = []
						for service in host.service_set.all():
							renderService.append(service)
						renderInterface = []
						for interface in host.interface_set.all():
							renderInterface.append(interface)
						renderHost.append([host, renderService, renderInterface])
					renderSlice.append([pleSlice, renderHost])
				renderEnvironment.append([environment, renderSlice])
		renderCourses.append([course, renderEnvironment])

	
	return render(request, 'listCourse.html', {'courses': renderCourses})
