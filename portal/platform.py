from manifold.core.query                import Query
from manifoldapi.manifoldapi            import execute_query

class Platform:
    def __init__ (self, id = None, name = None):
        if id is not None:
            platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled').filter_by('platform_id', '==', platform_id)
        if name is not None:
            platform_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled').filter_by('platform', '==', platform)
 
        self.id       = platform_query['platform_id']
        self.name     = platform_query['platform']
        self.type     = platform_query['gateway_type']
        self.disabled = platform_query['disabled']

#class Platforms:
#    def __init__ (self):
#        platforms_query  = Query().get('local:platform').select('platform_id','platform','gateway_type','disabled')
#        platforms_details = execute_query(self.request, platform_query)
#        for platform_detail in platforms_details:
#            Platform(id = platform_detail['platform_id'])
