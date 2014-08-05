#
# log functions for user activity
#

import activity

def login(request):
    activity.log(request, "user.login", "User log in")
    
def logout(request):
    activity.log(request, "user.logout", "User log out")

def signup(request):
    activity.log(request, "user.signup", "User sign up")

def register(request):
    activity.log(request, "user.register", "User registered")