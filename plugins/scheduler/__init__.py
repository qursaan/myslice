from unfold.plugin import Plugin

class Scheduler(Plugin):

    # set checkboxes if a final column with checkboxes is desired
    # pass columns as the initial set of columns
    #   if None then this is taken from the query's fields
    # latitude,longitude, zoom : the starting point
    def __init__ (self, query, query_all_resources, query_lease = None, **settings):
        Plugin.__init__ (self, **settings)
        self.query=query
        self.query_all_resources = query_all_resources
        self.query_all_resources_uuid = query_all_resources.query_uuid
        self.query_lease = query_lease
        self.query_lease_uuid = query_lease.query_uuid if query_lease else None

    def template_file (self):
        return "scheduler.html"

    def template_env (self, request):
        env={}
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "js/scheduler.js",
                           #"//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js",
                            "js/raphael.js",
                            "js/manifold.js", "js/manifold-query.js", 
                            "js/spin-presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                            "js/unfold-helper.js",
                            "js/jquery-ui-timepicker-addon.js", "js/jquery-ui-sliderAccess.js",
                           ],
            'css_files' : [ "css/scheduler.css",
                            "css/jquery-ui-timepicker-addon.css",
                            ],
            }
        return reqs

    # the list of things passed to the js plugin
    def json_settings_list (self): 
        return ['plugin_uuid','query_uuid', 'query_lease_uuid', 'query_all_resources_uuid']
