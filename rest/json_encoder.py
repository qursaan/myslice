import json
import datetime
import xmlrpclib
from time import mktime

class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.datetime) or isinstance(obj, xmlrpclib.DateTime):
            return int(mktime(obj.timetuple()))

        return json.JSONEncoder.default(self, obj)
