import time

from django.contrib.auth.models import User

from manifoldapi.manifoldapi    import ManifoldAPI, ManifoldException, ManifoldResult
from manifold.core.query        import Query

from myslice.settings import config, logger, DEBUG

# Name my backend 'ManifoldBackend'
class ManifoldBackend:

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, token=None):
        if not token:
            return None
        
        person = {}

        try:
            username = token['username']
            password = token['password']
            request = token['request']

            auth = {'AuthMethod': 'password', 'Username': username, 'AuthString': password}
            api = ManifoldAPI(auth)
            sessions_result = api.forward(Query.create('local:session').to_dict())
            sessions = sessions_result.ok_value()
            if not sessions:
                logger.error("GetSession failed", sessions_result.error())
                return
            session = sessions[0]
            logger.debug("SESSION : {}".format(session))
            
            # Change to session authentication
            api.auth = {'AuthMethod': 'session', 'session': session['session']}
            self.api = api

            # Get account details
            # the new API would expect Get('local:user') instead
            persons_result = api.forward(Query.get('local:user').to_dict())
            persons = persons_result.ok_value()
            if not persons:
                logger.error("GetPersons failed",persons_result.error())
                return
            person = persons[0]
            logger.debug("PERSON : {}".format(person))
            #logger.info("{} {} <{}> logged in"\
            #    .format(person['config']['first_name'], person['config']['last_name'], person['config']['email']))

            request.session['manifold'] = {'auth': api.auth, 'person': person, 'expires': session['expires']}
        except ManifoldException as e:
            logger.error("ManifoldException in Auth Backend: {}".format(e.manifold_result))
        except Exception as e:
            logger.error("Exception in Manifold Auth Backend: {}".format(e))
            import traceback
            traceback.print_exc()
            return None

        try:
            # Check if the user exists in Django's local database
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Create a user in Django's local database
            user = User.objects.create_user(username, username, 'passworddoesntmatter')
            user.email = person['email']

        if 'firstname' in person:
            user.first_name = person['firstname']
        if 'lastname' in person:
            user.last_name = person['lastname']

        return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


