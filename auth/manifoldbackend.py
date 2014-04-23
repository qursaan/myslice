import time

# import ldap for LDAP authentication - Edelberto
import ldap

from django.contrib.auth.models import User

from manifoldapi.manifoldapi    import ManifoldAPI, ManifoldException, ManifoldResult
from manifold.core.query        import Query

# Name my backend 'ManifoldBackend'
class ManifoldBackend:


    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, token=None):
    
        # LDAP local/global var
        checkldap = None

        if not token:
            return None

        try:
            print "ManifoldBackend authenticate()"
            # Mandatory fields in token
            username = token['username']
            request = token['request']

            # usernameldap is optional - from LDAP user form. 
            # If it is filled - See portal/homeview.py too
            if 'usernameldap' in token:
                usernameldap = token['usernameldap']
            else:
                usernameldap = None
            password = token['password']
            # if data are not from LDAP form then normal (local) login
            if not usernameldap:
                print "not userldap ManifoldBackend authenticate()"
                auth = {'AuthMethod': 'password', 'Username': username, 'AuthString': password}
                api = ManifoldAPI(auth)
                sessions_result = api.forward(Query.create('local:session').to_dict())
                print "result"
                sessions = sessions_result.ok_value()
                print "ok"
                if not sessions:
                    print "GetSession failed", sessions_result.error()
                    return
                print "first", sessions
                session = sessions[0]

                # Change to session authentication
                api.auth = {'AuthMethod': 'session', 'session': session['session']}
                self.api = api

                # Get account details
                # the new API would expect Get('local:user') instead
                persons_result = api.forward(Query.get('local:user').to_dict())
                persons = persons_result.ok_value()
                if not persons:
                    print "GetPersons failed",persons_result.error()
                    return
                person = persons[0]
                print "PERSON=", person

                request.session['manifold'] = {'auth': api.auth, 'person': person, 'expires': session['expires']}
            ################################
            # Edelberto LDAP authentication
            # if data are from LDAP form, so
            else:
                print "userldap ManifoldBackend authenticate()"
            # XXX UGLY
            # Needing to create an specific entries at settings.py (or myslice.ini) for these vars
            ##################################################
            # Edelberto - UFF - esilva@ic.uff.br
            # v1 - ldap authentication module
            # Note: focus on LDAP FIBRE-BR for DN
            #       if uses other DN, configuration are needed
            ###################################################
            #Searching an LDAP Directory

                try:
                    #uid = "debora@uff.br"

                    # Receiving an email address, how can we split and mount it in DN format?
                    #mail = "debora@uff.br"
                    mail = usernameldap
                    login = mail.split('@')[0]
                    org = mail.split('@')[1]
                    o = org.split('.')[0]
                    dc = org.split('.')[1]
                    '''
                    print mail
                    print login
                    print org
                    print o
                    print dc
                    '''

                    # DN format to authenticate - IMPORTANT!
                    #FIBRE-BR format
                    uid = "uid="+mail+",ou=people,o="+o+",dc="+dc
                    #uid = "uid=debora@uff.br,ou=people,o=uff,dc=br"
                    # User password from LDAP form
                    #userPassword = "fibre"
                    userPassword = password

                    # testing with:
                    # wrong password for test
                    #    userPassword = "fibre2"
                    
                    # Parameters to connect on LDAP
                    ldap.set_option(ldap.OPT_REFERRALS, 0)
                    # LDAP Server Address
                    l = ldap.open("127.0.0.1")
                    # LDAP version
                    l.protocol_version = ldap.VERSION3

                    #l.simple_bind(uid, userPassword)
                    # l.bind_s is necessary to do the authentication with a normal LDAP user
                    l.bind_s(uid, userPassword, ldap.AUTH_SIMPLE)
                    #print l.bind_s(uid, userPassword, ldap.AUTH_SIMPLE)

                    # DN base - Our root dc (dc=br)
                    baseDN="dc="+dc
                    searchScope = ldap.SCOPE_SUBTREE
                    retrieveAttributes = None
                    # User only can see its credentials. He search only his attributes
                    searchFilter = "uid="+mail

                    # Getting all attributes
                    try:
                        ldap_result_id = l.search(baseDN, searchScope, searchFilter, retrieveAttributes)
                        result_set = []
                        # while exist attributes, save them in a list!
                        while 1:
                        #   print l.result(ldap_result_id, 0)
                            result_type, result_data = l.result(ldap_result_id, 0)
                            if (result_data == []):
                            #print ("User %s don't allowed to bind in LDAP", uid)
                                break
                            else:
                                ## Appendng to a list
                                if result_type == ldap.RES_SEARCH_ENTRY:
                                    result_set.append(result_data)
                                    #    print result_set
                    except ldap.LDAPError, e:
                        print e

                    # Matching if the user is really who his say
                    #checkldap = None
                    if l.compare_s(uid, 'uid', mail):
                        # DEBUG
                        checkldap = True
                        print "match"

                # Now, based on default Manifold Auth
                        auth = {'AuthMethod': 'password', 'Username': usernameldap, 'AuthString': password}
                        api = ManifoldAPI(auth)
                        sessions_result = api.forward(Query.create('local:session').to_dict())
                        print "result"
                        sessions = sessions_result.ok_value()
                        print "ok"
                        if not sessions:
                            print "GetSession failed", sessions_result.error()
                            return
                        print "first", sessions
                        session = sessions[0]

                        # Change to session authentication
                        api.auth = {'AuthMethod': 'session', 'session': session['session']}
                        self.api = api

                        # Get account details
                        # the new API would expect Get('local:user') instead
                        persons_result = api.forward(Query.get('local:user').to_dict())
                        persons = persons_result.ok_value()
                        if not persons:
                            print "GetPersons failed",persons_result.error()
                            return
                        person = persons[0]
                        print "PERSON=", person

                        request.session['manifold'] = {'auth': api.auth, 'person': person, 'expires': session['expires']}

                    else:
                        print "no match. User doesnt allowed"
                        checkldap = False

                except ldap.LDAPError, e:
                    print "E: LDAP Search user", e                      
        # end of LDAP
       
        # Follow the same of Manifold 
        except ManifoldException, e:
            print "ManifoldBackend.authenticate caught ManifoldException, returning corresponding ManifoldResult"
            return e.manifold_result
        except Exception, e:
            print "E: manifoldbackend", e
            import traceback
            traceback.print_exc()
            return None
    
        if not usernameldap:
            try:
                # Check if the user exists in Django's local database
               user = User.objects.get(username=username)
            except User.DoesNotExist:
                # Create a user in Django's local database
                user = User.objects.create_user(username, usernamep, 'passworddoesntmatter')
                user.first_name = "DUMMY_FIRST_NAME" #person['first_name']
                user.last_name = "DUMMY LAST NAME" # person['last_name']
                user.email = person['email']
            return user
        else:
            if checkldap:
                try:
                    # Check if the user exists in Django's local database
                    user = User.objects.get(username=usernameldap)
                except User.DoesNotExist:
                    # Create a user in Django's local database
                    user = User.objects.create_user(username, usernameldap, 'passworddoesntmatter')
                    user.first_name = "DUMMY_FIRST_NAME" #person['first_name']
                    user.last_name = "DUMMY LAST NAME" # person['last_name']
                    user.email = person['email']
                return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


