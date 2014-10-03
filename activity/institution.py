#
# log functions for institution activity
#

import activity

def joined(request):
    activity.log(request, "institution.join", "Institution joined")

def join(request):
    activity.log(request, "institution.join.view", "Institution view join form")