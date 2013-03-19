import json
import uuid

def uniqid (): 
    return uuid.uuid4().hex

class ManifoldQuery:

    def __init__ (self, action=None, method=None, timestamp='now',
                  filters=[], params=[], fields=[],
                  sort=None, limit=None, offset=None,
                  ):
        self.query_uuid=uniqid()
        # settable
        self.action=action
        self.method=method
        self.timestamp=timestamp
        self.filters=filters
        self.params=params
        self.fields=fields
        self.sort=sort
        self.limit=limit
        self.offset=offset
        # internal data
        self.analyzed_query=None
        self.subqueries = {}

    def __repr__ (self):
        result="Q: id=%(query_uuid)s - %(action)s on %(method)s "%self.__dict__
        result += " with %d filters, %d fields"%(len(self.filters),len(self.params))
        return result

    def to_json (self):
        query_uuid=self.query_uuid
        a=self.action
        m=self.method
        t=self.timestamp
        f=json.dumps (self.filters)
        p=json.dumps (self.params)
        c=json.dumps (self.fields)
        # xxx unique can be removed, but for now we pad the js structure
        unique=0

        aq = self.analyzed_query.to_json() if self.analyzed_query else 'null'
        # subqueries is a dictionary method:query
        if not self.subqueries: 
            sq="{}"
        else:
            sq=", ".join ( [ "'%s':%s" % (method, subquery.to_json())
                      for (method, subquery) in self.subqueries.iteritems()])
            sq="{%s}"%sq
        
        return """ new ManifoldQuery('%(a)s', '%(m)s', '%(t)s', %(f)s, %(p)s, %(c)s, %(unique)s, '%(query_uuid)s', %(aq)s, %(sq)s)"""%locals()
    
    # this builds a ManifoldQuery object from a dict as received from javascript through its ajax request 
    # e.g. here's what I captured from the server's output
    # incoming POST <QueryDict: {u'query[method]': [u'slice'], u'query[fields][]': [u'slice_hrn'], u'query[timestamp]': [u'latest'], u'query[action]': [u'get']}>
    def fill_from_dict (self, d):
        for key in d.keys():
            for arg in ['action', 'method', 'filters', 'fields', 'timestamp', 'params']:
                if arg in key:
                    # dirty hack around fields; fields must be a list
                    if arg == 'fields': 
                        setattr(self, arg, [d[key]])
                    else: 
                        setattr(self, arg, d[key])
                    break

    # not used yet ..
    def analyze_subqueries(self):
        analyzed_query = ManifoldQuery()
        analyzed_query.query_uuid = self.query_uuid
        analyzed_query.action = self.action
        analyzed_query.method = self.method
        analyzed_query.timestamp = self.timestamp

        # analyse query filters
        # filter syntax : ['key', 'oparation', 'value']
        for filter in self.filters:
            key = filter[0]
            operation = filter[1]
            value = filter[2]
            if '.' in key:
                method = key.split('.')[0]
                field = key.split('.')[1]
                if not analyzed_query.subqueries[method]:
                    subquery = ManifoldQuery()
                    subquery.action = self.action
                    subquery.method = method
                    subquery.timestamp = self.timestamp
                    analyzed_query.subqueries[method] = subquery

                analyzed_query.subqueries[method].filters.append([field, operation, value])
            else:
                analyzed_query.filters.append(filter)

        # analyse query params
        # params syntax : params = {'param1': value1, 'param2': value2, ...}
        for param in self.params.keys():
            if '.' in param:
                method = param.split('.')[0]
                field = param.split('.')[1]
                if not analyzed_query.subqueries[method]:
                    subquery = ManifoldQuery()
                    subquery.action = self.action
                    subquery.method = method
                    subquery.timestamp = self.timestamp
                    analyzed_query.subqueries[method] = subquery

                analyzed_query.subqueries[method].params[field] = self.params[param]
            else:
                analyzed_query.params[param] = self.params[param]

        # analyse query fields
        # fields syntax: fields = [element1, element2, ....]
        for element in self.fields:
            if '.' in element:
                method = element.split('.')[0]
                field = element.split('.')[1]
                if not analyzed_query.subqueries[method]:
                    subquery = ManifoldQuery()
                    subquery.action = self.action
                    subquery.method = method
                    subquery.timestamp = self.timestamp
                    analyzed_query.subqueries[method] = subquery

                analyzed_query.subqueries[method].fields.append(field)
            else:
                analyzed_query.fields.append(element)        


        # default subqueries 
        if analyzed_query.method == 'slice':
            if not analyzed_query.subqueries['resource']:
                subquery = ManifoldQuery()
                subquery.action = self.action
                subquery.method = method
                subquery.timestamp = self.timestamp
                analyzed_query.subqueries['resource'] = subquery

            if not analyzed_query.subqueries['lease']:
                subquery = ManifoldQuery()
                subquery.action = self.action
                subquery.method = method
                subquery.timestamp = self.timestamp
                analyzed_query.subqueries['lease'] = subquery


        self.analyzed_query = analyzed_query
