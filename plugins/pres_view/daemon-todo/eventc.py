#!/usr/bin/env python

import sys, time
from event import Event
import pprint


##TEMP / DEBUG##
import pickle
import os.path
import xmlrpclib
###

if __name__ == "__main__":
    
    liste=[]
    
    #event = Event("anonymous;https://www.planet-lab.eu/PLCAPI/;GetSites;{"name": "University of Colombo School of Computing"};["name","date_created"];")
    #event2 = Event("anonymous;https://www.planet-lab.eu/PLCAPI/;GetSites;{"name": "University of Colombo School of Computing"};["name","date_created"];")
    #event.split()
    #event.makeAuth()
    #liste.append(event)
    #print event.split()
    #event2 = Event("toto")
    #event2.split()
    #event2.makeAuth()
    #liste.append(event2)

   # print liste[0].data
    #print liste[1].get_event_list_from_xmlrpc()
    config = open("config_event", "r")
    #for ligne in config:
    #    print ligne.rstrip("\n\r")
    #config.close()
    
    for event in liste:
        pass#print event.data
    
    config = open("config_event", "r")
    events=[]
        #initialisation de la liste des instance d"objet event:
    for ligne in config:
            #on creer l"objet
        #print ligne.rstrip("\n\r")
        event = Event(ligne.rstrip("\n\r"))
        events.append(event)
    config.close()

    #fichier = open("leNomDuFichier2.txt", "w")
    for event in events:
        
        data = event.data
        print data
        #print str("-")
        #print type(event.return_fields)
        #print str("-")
        #a=0
        #for d in data:
            #print a
            #a=a+1
            #print event.get_geoposition("toto")
            #print d
           # pass
        #print "\n"
        #fichier.write(data)
        #fichier.write("pwet")
        passs
    #fichier.close()
    server="https://www.planet-lab.eu/PLCAPI/"
    auth = {}
    auth["AuthMethod"] = "anonymous"
    srv = xmlrpclib.Server(server, allow_none = 1)
    sites_id = srv.GetSites(auth, {}, ["latitude","longitude"])
    #print sites_id
    for i in sites_id:
        #print i
        #print "\n"
        #print i["longitude"],i["longitude"]
        pass
