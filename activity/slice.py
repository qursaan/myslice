#
# log functions for slice
#

import activity

def validate(request, o):
    activity.log(request, "slice.validate", "Slice validation", o)
    
def resource(request, o):
    activity.log(request, "slice.resource", "Resource reservation", o)