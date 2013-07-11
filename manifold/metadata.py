import json 

from manifold.manifoldresult import ManifoldResult
from manifold.manifoldapi import ManifoldAPI

debug=False
debug=True

# turn this on if you want to work offline
work_offline=False
#work_offline=True

class MetaData:

    def __init__ (self, auth):
        self.auth=auth
        self.hash_by_object={}

    def fetch (self):
        offline_filename="offline-metadata.json"
        if work_offline:
            try:
                with file(offline_metadata) as f:
                    self.hash_by_object=json.loads(f.read())
                return
            except:
                print "metadata.work_offline: failed to decode %s"%offline_filename
        manifold_api = ManifoldAPI(self.auth)
        fields = ['table', 'column.column',
                  'column.description','column.header', 'column.title',
                  'column.unit', 'column.info_type',
                  'column.resource_type', 'column.value_type',
                  'column.allowed_values', 'column.platforms.platform',
                  'column.platforms.platform_url']
        result = manifold_api.Get({
            'object': 'local:object', # proposed to replace metadata:table
            'fields':     fields 
        })

        if result['code'] == 1: # warning
            messages.warning(request, result['description'])
        elif result['code'] == 2:
            messages.error(request, result['description'])
            # XXX FAIL HERE XXX

        rows = result.ok_value()
# API errors will be handled by the outer logic
#        if not rows:
#            print "Failed to retrieve metadata",rows_result.error()
#            rows=[]
        self.hash_by_object = dict ( [ (row['table'], row) for row in rows ] )
        # save for next time we use offline mode
        if debug and rows:
            with file(offline_filename,'w') as f:
                f.write(json.dumps(self.hash_by_object))

    def to_json(self):
        return json.dumps(self.hash_by_object)

    def details_by_object (self, object):
        return self.hash_by_object[object]

    def sorted_fields_by_object (self, object):
        return self.hash_by_object[object]['column'].sort()

    def get_field_type(self, object, field):
        print "Temp fix for metadata::get_field_type() -> consider moving to manifold.core.metadata soon"
        return field
