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
        # xxx this is unused for now
        self.sort=sort
        self.limit=limit
        self.offset=offset
        # internal data - likewise, this is unused as of yet, although we have
        # (untested) code below in analyze_subqueries to compute these..
        self.analyzed_query=None
        self.subqueries = {}

    def __repr__ (self):
        result="Q: id=%(query_uuid)s - %(action)s on %(subject)s "%self.__dict__
        result += " with %d filters, %d fields"%(len(self.filters),len(self.params))
        return result

    def to_json (self):
        query_uuid=self.query_uuid
        a=self.action
        s=self.subject
        t=self.timestamp
        f=json.dumps (self.filters)
        print 'filters f=',f
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
    # e.g. here's what I captured from the server's output
    # incoming POST <QueryDict: {u'query[subject]': [u'slice'], u'query[fields][]': [u'slice_hrn'], u'query[timestamp]': [u'latest'], u'query[action]': [u'get']}>
    def fill_from_dict (self, d):
        for key in d.keys():
            for arg in ['action', 'subject', 'filters', 'fields', 'timestamp', 'params']:
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
