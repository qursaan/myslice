# import the User object
from django.contrib.auth.models import User

# import the IMAP library
#from imaplib import IMAP4

# import time - this is used to create Django's internal username
import time

# Name my backend 'MyCustomBackend'
class MyCustomBackend:

    hard_wired_users = { 'jean': '1234',
                         'root': '2345',
                         'jacques': '3456',
                         }


    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, token=None):
        username=token['username']
        password=token['password']
        users=MyCustomBackend.hard_wired_users
        if username not in users: return None
        if password != users[username]: return None
        try:
            # Check if the user exists in Django's local database
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            print 'creating django user',username
            # Create a user in Django's local database
            # warning: the trick here is pass current time as an id, and name as email
            # create_user(username, email=None, password=None)
            user = User.objects.create_user(time.time(), username, 'password-doesnt-matter')

        return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
