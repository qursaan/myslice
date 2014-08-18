#
# log functions for user activity
#

import activity

def login(request, state=None):
    if state is not None :
        activity.log(request, "user.login." + state, "User log in")
    else :
        activity.log(request, "user.login", "User log in")
    
def logout(request):
    activity.log(request, "user.logout", "User log out")

def signup(request):
    activity.log(request, "user.signup.view", "User sign up")

def registered(request):
    activity.log(request, "user.signup", "User registered")

def contact(request):
    activity.log(request, "user.contact", "User sent a contact request")