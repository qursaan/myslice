# !/usr/bin/python
# -*-coding: utf-8-*-

import pickle
import os.path
import xmlrpclib
import ast
import time
import simplejson

class Event2:
    def __init__(self, structure):
        ##Definition des variables##
        self.data_access_methode    =   ""
        self.data_access_options    =   ""
        
        self.structure              =   structure
        self.methode                =   ""
        self.parameters             =   {}
        self.return_fields          =   []
        self.print_method           =   ""
        self.print_options          =   ""
        self.geo_methode            =   ""
        self.id                     =   ""
        self.timestamp              =   ""
        #on paramètre timestamp, si c'est un dynamique, il sera fournit, sinon, on le met à 0
        timestamp=0;
        
        ##APE###
        self.raw                    =   ""
        self.channel                =   ""
        #######
        
        ## On creer l'objet ##
        self.data = self.make_data(timestamp)
        
        
    def split(self):
        args = self.structure.split(";");
        self.channel                =   args[1]  
        self.raw                    =   args[3]
        self.data_access_methode    =   args[4]
        self.data_access_options    =   ast.literal_eval(args[5])
        self.print_method           =   args[6]
        self.print_options          =   ast.literal_eval(args[7])
        self.methode                =   args[8]
        self.parameters             =   ast.literal_eval(args[9])
        self.return_fields          =   eval(args[10])
        self.timestamp              =   args[11]

    def get_event_list_from_xmlrpc(self,timestamp):
        
        ## on test pour voir si on est en dynamique, si c'est le cas, on met à jour la valeur du timestamp
        if timestamp!=0:
            self.parameters[self.timestamp]         =   int(timestamp)
            
            
        ####on cree l'identification
        auth = {}
        if self.data_access_options["authType"]     ==  "anonymous":
            auth["AuthMethod"]  =   "anonymous"
            
        elif self.data_access_options["authType"]   ==  "password":
            auth["AuthMethod"]  =   "password"
            auth["Username"]    =   self.data_access_options["Username"]
            auth["AuthString"]  =   self.data_access_options["AuthString"]
            
        elif self.data_access_options["authType"]   ==  "session":
            auth["AuthMethod"]  =   "session"
            auth["session"]     =   self.data_access_options["session"]
            
        elif self.data_access_options["authType"]   ==  "gpg":
            auth["AuthMethod"]  =   "gpg"
            auth["name"]        =   self.data_access_options["name"]
            auth["signature"]   =   self.data_access_options["signature"]
        
         
        srv = xmlrpclib.Server(self.data_access_options["server"], allow_none = 1)
        
        
        ##On gère en fonction des methodes
        
        if self.methode=="GetSites":
            self.geo_methode="site_id";
            try :
                if len(self.return_fields)==0:
                    data =  srv.GetSites(auth, self.parameters) 
                else :
                    data = srv.GetSites(auth, self.parameters, self.return_fields)
            except:
                    return self.parameters
        else:
            return 2
        
        ###on recupère la liste des localisation
        
        ##si il y a moins de 8 resultats, on recupère seulement la localisation de ceux-ci
        list=[]
        try:
            sites_id = srv.GetSites(auth,{},["site_id","latitude","longitude"])
        except :
            return 3
        try:
            for i in data:
                for j in sites_id:
                    if i["site_id"]==j["site_id"]:
                        try:
                            pos=[{"latitude": j["latitude"], "longitude": j["longitude"]}]
                        except:
                            return 4
                        i["ape_position"] = pos
                        list.append(i)
        except:
            return 5    
        return list
        

    
    def make_data(self,timestamp):
        try :
            self.split()
        except:
            return 43
        try :
            if self.data_access_methode=="xmlrpc":
                return self.get_event_list_from_xmlrpc(timestamp)
        except: 
            return 67
        
