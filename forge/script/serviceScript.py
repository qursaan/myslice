#!/usr/bin/env python

import paramiko
from scp import SCPClient
import time

yumOpt = "sudo -S yum -y --nogpgcheck "

# Functions used for the php module (you need to install an http server)
def setPHP(ssh):
	execute(yumOpt+" install php", ssh)
	execute("sudo -S /sbin/service httpd restart", ssh)

def removePHP(ssh):
	execute(yumOpt+" remove php", ssh)

# Functions used for the X redirection using ssh
def setXRedirect(ssh):
	# Installing X11 system and an alternate ssh server
	execute(yumOpt+" install xorg-x11-xauth", ssh)
	#time.sleep(10)

def removeXRedirect(ssh):
	# Remove X11 system and the alternate ssh server
	execute(yumOpt+" remove xorg-x11-xauth", ssh)


# Functions used for an http server
def setHttpd(ssh, port, hostUrl):
	port = int(port)
	execute(yumOpt+" install -y httpd", ssh)
	SCPClient(ssh.get_transport()).put("./configService/httpd.conf", "~")
	SCPClient(ssh.get_transport()).put("./configService/index.html", "~")
	execute("sudo -S mv ~/index.html /var/www/html/", ssh)
	execute("sudo -S echo \"<html>You are on "+str(hostUrl)+"</html>\" >> /var/www/html/index.html", ssh)
	execute("sudo -S dd if=/dev/zero of=/var/www/html/file1Mo bs=1M count=1", ssh)
	execute("sudo -S chmod a+r /var/www/html/file1Mo", ssh)
	execute("sudo -S mv ~/httpd.conf /etc/httpd/conf/", ssh, display = True)
	execute("sudo -S chown root:root /etc/httpd/conf/httpd.conf", ssh, display = True)
	execute("sudo -S sed -i -e \"s/Listen \\*:80/Listen \\*:"+str(port)+"/g\" /etc/httpd/conf/httpd.conf", ssh)
	returnCode = -1
	while(returnCode != 0):
		time.sleep(2)
		returnCode = execute("sudo -S /sbin/service httpd restart", ssh, display = True)
		print returnCode
		if returnCode != 0:
			execute("sudo -S sed -i -e \"s/Listen \\*:"+str(port)+"/Listen \\*:"+str(port+1)+"/g\" /etc/httpd/conf/httpd.conf", ssh)
			port += 1
	return port

def removeHttpd(ssh):
	#Remove the httpd service
	execute(yumOpt+" remove httpd", ssh)
	execute("sudo -S rm -rf /etc/httpd/*", ssh)


# Functions used for wireshark traffic analyzer (you have to install X redirection)
def setWireshark(ssh):
	# Install wireshark
	execute(yumOpt+" install wireshark wireshark-gnome", ssh)
	execute(yumOpt+" install wireshark xorg-x11-fonts-Type1", ssh)
	
def removeWireshark(ssh):
	# Remove wireshark
	execute(yumOpt+" remove wireshark wireshark-gnome", ssh)
	execute(yumOpt+" remove wireshark xorg-x11-fonts-Type1", ssh)

# Functions used for the browser firefox (you have to install X redirection)
def setFirefox(ssh):
	# Install firefox
	execute(yumOpt+" install firefox", ssh)
	execute("sudo -S sh -c \"dbus-uuidgen > /var/lib/dbus/machine-id\"", ssh)

def removeFirefox(ssh):
	# Remove firefox
	execute(yumOpt+" remove firefox", ssh)


# Function used to execute a command on a remote host using ssh
def execute(command, ssh, display=False, retour=False):
	print "# "+command
	stdin, stdout, stderr = ssh.exec_command(command)
	stdin.close()
	# Wait for the end of the command
	while not stdout.channel.exit_status_ready():
		time.sleep(2)
	err = stderr.read()
	if err != None:
		splitted = err.splitlines()
		if len(splitted) > 0:
			print "\tError in execution"
			for line in splitted:
				print "\t > " + line	
	if display:
		for line in stdout.read().splitlines():
			print " > " + line
	elif retour:
		return stdout.read()
	return stdout.channel.recv_exit_status()
