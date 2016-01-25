import time

from django.contrib.auth.models import User

from manifoldapi.manifoldapi    import ManifoldAPI, ManifoldException, ManifoldResult
from manifold.core.query        import Query

from myslice.settings import config, logger, DEBUG

from portal.actions import authority_check_pis

# from unfold.sessioncache import SessionCache

# Name my backend 'ManifoldBackend'
class ManifoldBackend:

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, token=None):
        if not token:
            return None
        
        person = {}

        try:
            email = token['username']
            username = email.split('@')[-1]
            password = token['password']
            request = token['request']

            auth = {'AuthMethod': 'password', 'Username': email, 'AuthString': password}
            api = ManifoldAPI(config.manifold_url(), auth)
            sessions_result = api.forward(Query.create('local:session').to_dict())
            sessions = sessions_result.ok_value()
            if not sessions:
                logger.error("GetSession failed: {}".format(sessions_result.error()))
                return None
            session = sessions[0]
            logger.debug("SESSION : {}".format(session.keys()))
            
            # Change to session authentication
            api.auth = {'AuthMethod': 'session', 'session': session['session']}
            #api.auth = session_auth
            self.api = api

            # Get account details
            # the new API would expect Get('local:user') instead
            persons_result = api.forward(Query.get('local:user').to_dict())
            persons = persons_result.ok_value()
            if not persons:
                logger.error("GetPersons failed: {}".format(persons_result.error()))
                return None
            person = persons[0]
            logger.debug("PERSON : {}".format(person))
            
            request.session['manifold'] = {'auth': api.auth, 'person': person, 'expires': session['expires']}

            #logger.info("{} {} <{}> logged in"\
            #    .format(person['config']['first_name'], person['config']['last_name'], person['config']['email']))

            #SessionCache().store_auth(request, session_auth)

        except ManifoldException as e:
            logger.error("ManifoldException in Auth Backend: {}".format(e.manifold_result))
        except Exception as e:
            logger.error("Exception in Manifold Auth Backend: {}".format(e))
            import traceback
            logger.error(traceback.format_exc())
            return None

        try:
            # Check if the user exists in Django's local database
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Create a user in Django's local database
            user = User.objects.create_user(username, email, 'passworddoesntmatter')
            user.email = person['email']

        if 'firstname' in person:
            user.first_name = person['firstname']
        if 'lastname' in person:
            user.last_name = person['lastname']

        user.pi = authority_check_pis (request, user.email)
        request.session['user'] = {'email':user.email,'pi':user.pi,'firstname':user.first_name,'lastname':user.last_name}
        return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


