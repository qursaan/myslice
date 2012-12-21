# needed imports
# uniqid

xxx this code is broken and not used 

class Query:

    def __init__ (self):
        self.action=None
        self.method=None
        self.ts=None
        self.filters=[]
        self.params=[]
        self.fields=[]
        self.unique=False
        # xxx 
        self.uuid=uniquid()
        self.sort=None
        self.limit=None
        self.offset=None
        self.analyzed_query=None
        self.subqueries = []

    def to_json (self):
        return "Query.json: todo"

