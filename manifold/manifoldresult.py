def enum(*sequential, **named):
    enums = dict(zip(sequential, range(len(sequential))), **named)
    return type('Enum', (), enums)

ManifoldCode = enum (
    SUCCESS=0,
    SESSION_EXPIRED=1,
    OTHERS=2,
)

# being a dict this can be used with json.dumps
class ManifoldResult (dict):
    def __init__ (self, code=ManifoldCode.SUCCESS, value=None, output=""):
        self['code']=code
        self['value']=value
        self['output']=output

    def from_json (self, json_string):
        d=json.dumps(json_string)
        for k in ['code','value','output']:
            self[k]=d[k]

    # this returns None if there's a problem, the value otherwise
    def ok_value (self):
        if self['code']==ManifoldCode.SUCCESS:
            return self['value']

    def error (self):
        return "code=%s -- %s"%(self['code'],self['output'])
    
