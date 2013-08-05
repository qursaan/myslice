#!/usr/bin/env python

import sys, time
from daemon import Daemon
from event2 import Event2
import cgi
import urllib2
import simplejson

class MyDaemon(Daemon):    
    def run(self):
        self.server = 'http://0.ape.planet-lab.eu:443/?'
        self.ape_pwd = 'testpasswd'
        self.ape_cmd = 'inlinepush'
        ## Ouverture et traitement du fichier de conf
        #ouverture du fichier
        config = open("config_method_dynamic", "r")
        events=[]
        #initialisation de la liste des instance d'objet event:
        for ligne in config:
            #on creer l'objet
            event = Event2(ligne.rstrip('\n\r'))
            
            events.append(event)
        config.close()
        ## creation des objets et ajout dans une liste
        timestamp=time.time()-800000
        #timestamp_new=time.time()
        while True:
            for event in events:
                event.data = event.make_data(timestamp);
                cmd = [{"cmd": self.ape_cmd,
                        "params": {
                           "password": self.ape_pwd,
                           "raw": event.raw,
                           "channel": event.channel,
                           "data": {
                                "print_options": event.print_options,
                                "print_method": event.print_method,
                                "message": event.data
                           }
                       }
                }]
                print cmd
                url = self.server + urllib2.quote(simplejson.dumps(cmd))
                urllib2.urlopen(url)
            ##pour chaque objet de la liste on regarde les data 
            ## => il faut instancier un tableau de temps
            ## on instancie un temps en debut de boucle ex temps=time.now()
            time.sleep(15)
            #timestamp=timestamp_new
            #timestamp_new=time.time()

if __name__ == "__main__":
    daemon = MyDaemon('/tmp/daemon-example.pid')
    if len(sys.argv) == 2:
        if 'start' == sys.argv[1]:
            daemon.start()
        elif 'stop' == sys.argv[1]:
            daemon.stop()
        elif 'restart' == sys.argv[1]:
            daemon.restart()
        else:
            print "Unknown command"
            sys.exit(2)
        sys.exit(0)
    else:
        print "usage: %s start|stop|restart" % sys.argv[0]
        sys.exit(2)
