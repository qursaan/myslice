#!/usr/bin/env python

#Edelberto from manifoldauth
import os,sys
import subprocess
import shlex
import getpass
from hashlib import md5
import time
from random import Random
import crypt
	
username = 'teste'
password = '123'

command = '/var/www/manifold/manifold/bin/adduser.py ' + username + ' ' + password
    #command = 'ls -la'
args = shlex.split(command)
p = subprocess.Popen(args, stdin=subprocess.PIPE).communicate()[0]
print command
print args
print p
