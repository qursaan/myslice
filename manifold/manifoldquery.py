import json
import uuid

def uniqid (): 
    return uuid.uuid4().hex

debug=False
debug=True

class ManifoldQuery:

    def __init__ (self, action=None, subject=None, timestamp='now',
                  filters=[], params=[], fields=[],
                  sort=None, limit=None, offset=None,
                  ):
        self.query_uuid=uniqid()
        # settable
        self.action=action
        self.subject=subject
        self.timestamp=timestamp
        self.filters=filters
        self.params=params
        self.fields=fields
        # xxx these are unused for now....
        self.sort=sort
        self.limit=limit
        self.offset=offset
        # internal data - likewise, this is unused as of yet, although we have
        # (untested) code below in analyze_subqueries to compute these..
        self.analyzed_query=None
        self.subqueries = {}

    def __repr__ (self):
        result="[[Q: id=%(query_uuid)s - %(action)s on %(subject)s "%self.__dict__
        result += " with %d filters, %d fields"%(len(self.filters),len(self.params))
        result += "]]"
        return result

    def to_json (self):
        query_uuid=self.query_uuid
        a=self.action
        s=self.subject
        t=self.timestamp
        f=json.dumps (self.filters)
        p=json.dumps (self.params)
        c=json.dumps (self.fields)
        # xxx unique can be removed, but for now we pad the js structure
        unique=0

        aq = self.analyzed_query.to_json() if self.analyzed_query else 'null'
        # subqueries is a dictionary subject:query
        if not self.subqueries: 
            sq="{}"
        else:
            sq=", ".join ( [ "'%s':%s" % (subject, subquery.to_json())
                      for (subject, subquery) in self.subqueries.iteritems()])
            sq="{%s}"%sq
        
        result= """ new ManifoldQuery('%(a)s', '%(s)s', '%(t)s', %(f)s, %(p)s, %(c)s, %(unique)s, '%(query_uuid)s', %(aq)s, %(sq)s)"""%locals()
        if debug: print 'ManifoldQuery.to_json:',result
        return result
    
    # this builds a ManifoldQuery object from a dict as received from javascript through its ajax request 
    # we use a json-encoded string - see manifold.js for the sender part 
    # e.g. here's what I captured from the server's output
    # manifoldproxy.proxy: request.POST <QueryDict: {u'json': [u'{"action":"get","subject":"resource","timestamp":"latest","filters":[["slice_hrn","=","ple.inria.omftest"]],"params":[],"fields":["hrn","hostname"],"unique":0,"query_uuid":"436aae70a48141cc826f88e08fbd74b1","analyzed_query":null,"subqueries":{}}']}>
    def fill_from_POST (self, POST_dict):
        try:
            json_string=POST_dict['json']
            dict=json.loads(json_string)
            for (k,v) in dict.iteritems(): 
                setattr(self,k,v)
        except:
            print "Could not decode incoming ajax request as a Query, POST=",POST_dict
            if (debug):
                import traceback
                traceback.print_exc()

    # not used yet ..
    def analyze_subqueries(self):
        analyzed_query = ManifoldQuery()
        analyzed_query.query_uuid = self.query_uuid
        analyzed_query.action = self.action
        analyzed_query.subject = self.subject
        analyzed_query.timestamp = self.timestamp

        # analyse query filters
        # filter syntax : ['key', 'oparation', 'value']
        for filter in self.filters:
            key = filter[0]
            operation = filter[1]
            value = filter[2]
            if '.' in key:
                parts=key.split('.')
                subject = parts[0]
                field = parts[1]
                if not analyzed_query.subqueries[subject]:
                    subquery = ManifoldQuery()
                    subquery.action = self.action
                    subquery.subject = subject
                    subquery.timestamp = self.timestamp
                    analyzed_query.subqueries[subject] = subquery

                analyzed_query.subqueries[subject].filters.append([field, operation, value])
            else:
                analyzed_query.filters.append(filter)

        # analyse query params
        # params syntax : params = {'param1': value1, 'param2': value2, ...}
        for param in self.params.keys():
            if '.' in param:
                parts=param.split('.')
                subject = parts[0]
                field = parts[1]
                if not analyzed_query.subqueries[subject]:
                    subquery = ManifoldQuery()
                    subquery.action = self.action
                    subquery.subject = subject
                    subquery.timestamp = self.timestamp
                    analyzed_query.subqueries[subject] = subquery

                analyzed_query.subqueries[subject].params[field] = self.params[param]
            else:
                analyzed_query.params[param] = self.params[param]

        # analyse query fields
        # fields syntax: fields = [element1, element2, ....]
        for element in self.fields:
            if '.' in element:
                parts=element.split('.')
                subject = parts[0]
                field = parts[1]
                if not analyzed_query.subqueries[subject]:
                    subquery = ManifoldQuery()
                    subquery.action = self.action
                    subquery.subject = subject
                    subquery.timestamp = self.timestamp
                    analyzed_query.subqueries[subject] = subquery

                analyzed_query.subqueries[subject].fields.append(field)
            else:
                analyzed_query.fields.append(element)        


        # default subqueries 
        if analyzed_query.subject == 'slice':
            if not analyzed_query.subqueries['resource']:
                subquery = ManifoldQuery()
                subquery.action = self.action
                subquery.subject = subject
                subquery.timestamp = self.timestamp
                analyzed_query.subqueries['resource'] = subquery

            if not analyzed_query.subqueries['lease']:
                subquery = ManifoldQuery()
                subquery.action = self.action
                subquery.subject = subject
                subquery.timestamp = self.timestamp
                analyzed_query.subqueries['lease'] = subquery


        self.analyzed_query = analyzed_query

    def to_dict(self):
        return {
            'action': self.action,
            'fact_table': self.subject,
            'ts': self.timestamp,
            'filters': self.filters,
            'params': self.params,
            'fields': self.fields
        }
