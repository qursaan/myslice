# import the User object
from django.contrib.auth.models import User
from engine.manifoldapi import ManifoldAPI


# import time - this is used to create Django's internal username
import time

# Name my backend 'ManifoldBackend'
class ManifoldBackend:

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, token=None):
        if not token:
            return None

        try:
            username = token['username']
            password = token['password']
            request = token['request']

            auth = {'AuthMethod': 'password', 'Username': username, 'AuthString': password}
            api = ManifoldAPI(auth)
            # Authenticate user and get session key
            session = api.GetSession()
            if not session : 
                return None
            
            request.session['manifold_session'] = session
            #self.session = session
            # Change GetSession() at some point to return expires as well
            expires = time.time() + (24 * 60 * 60)

            # Change to session authentication
            api.auth = {'AuthMethod': 'session', 'session': session}
            #self.api = api

            # Get account details
            person = api.GetPersons(auth)[0]
            request.session['manifold_person'] = person
            #self.person = person[0]
        except:
            return None

        try:
            # Check if the user exists in Django's local database
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Create a user in Django's local database
            user = User.objects.create_user(username, username, 'passworddoesntmatter')
            user.first_name = person['first_name']
            user.last_name = person['last_name']
            user.email = person['email']
        return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


