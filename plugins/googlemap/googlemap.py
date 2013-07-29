from unfold.plugin import Plugin

class GoogleMap (Plugin):

    # set checkboxes if a final column with checkboxes is desired
    # pass columns as the initial set of columns
    #   if None then this is taken from the query's fields
    # latitude,longitude, zoom : the starting point
    def __init__ (self, query, query_all_uuid = None, latitude=43., longitude=7., zoom=4, **settings):
        Plugin.__init__ (self, **settings)
        self.query=query
        self.query_all_uuid = query_all_uuid
        self.latitude=latitude
        self.longitude=longitude
        self.zoom=zoom

    def template_file (self):
        return "googlemap.html"

    def template_env (self, request):
        env={}
        return env

    def requirements (self):
        reqs = {
            'js_files' : [ "https://maps.googleapis.com/maps/api/js?sensor=false", 
                           "/js/googlemap.js",
                           "/js/markerclusterer.js",
                            "js/manifold.js", "js/manifold-query.js", 
                            "js/spin.presets.js", "js/spin.min.js", "js/jquery.spin.js", 
                            "js/unfold-helper.js",
                           ],
            'css_files' : [ "css/googlemap.css",
                            ],
            }
        return reqs

    # the list of things passed to the js plugin
    def json_settings_list (self): return ['plugin_uuid','query_uuid', 'query_all_uuid', 'latitude', 'longitude', 'zoom', ]
