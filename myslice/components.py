from django.conf.urls import include, url
from myslice.settings import config, logger

def list():
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
            logger.error("Cannot load component ({}): {}".format(component, e))
        else:
            logger.info("Loaded component {}".format(component))
            
    return u

