from django.conf.urls import include, url
from myslice.configengine import ConfigEngine

def list():
    config = ConfigEngine()
    if config.myslice.components :
        return config.myslice.components.split(',')
    else :
        return []

def urls():
    u = []
    for component in list():
        try:
            __import__(component)
            u.append( url(r'^%s/' % component, include('%s.urls' % component)) )
        except Exception, e:
            print "-> Cannot load component (%s): %s" % (component, e)
        else:
            print "-> Loaded component %s" % component
            
    return u

