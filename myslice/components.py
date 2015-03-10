from django.conf.urls import include, url
from myslice.configengine import ConfigEngine

def urls():
    config = ConfigEngine()
    u = []
    for component in config.myslice.components.split(','):
        try:
            __import__(component)
            u.append( url(r'^%s/' % component, include('%s.urls' % component)) )
        except Exception, e:
            print "-> Cannot load component (%s): %s" % (component, e)
        else:
            print "-> Loaded component %s" % component
            
    return u
