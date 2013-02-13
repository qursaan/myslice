# import the User object
from django.contrib.auth.models import User
from engine.manifoldapi import ManifoldAPI


# import time - this is used to create Django's internal username
import time

# Name my backend 'ManifoldBackend'
class ManifoldBackend:

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, username=None, password=None):
        if not username or not password:
            return None

        try:
            auth = {'AuthMethod': 'password', 'Username': username, 'AuthString': password}
            api = ManifoldAPI(auth)
            # Authenticate user and get session key
            session = api.GetSession()
            if not session : 
                return None

            #self.session = session
            # Change GetSession() at some point to return expires as well
            expires = time.time() + (24 * 60 * 60)

            # Change to session authentication
            api.auth = {'AuthMethod': 'session', 'session': session}
            #self.api = api

            # Get account details
            person = api.GetPersons(auth)
            #self.person = person[0]
        except:
            return None

        try:
            # Check if the user exists in Django's local database
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            # Create a user in Django's local database
            user = User.objects.create_user(time.time(), username, 'passworddoesntmatter')

        return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


