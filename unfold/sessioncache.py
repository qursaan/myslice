import uuid

from manifold.util.singleton import Singleton

from myslice.settings import logger

# the key attached to the session object, where we store
# the uuid attached to that session in this cache
cache_key = 'cached_uuid'

class _SessionExtension(object):
    """
    This object holds all the data we need to attach to a django session object
    """

    def __init__(self):
        self.metadata = None
        self.auth = None

    def __repr__(self):
        result = "<SessionExtension"
        if self.metadata: result += " .metadata"
        if self.auth:     result += " .auth"
        result += ">"
        return result

class SessionCache(dict):
    """
    As of django1.7, the session object as attached to a django request
    gets JSON-serialized instead of pickled
    This breaks our previous or passing data from request to request across
    a given session - in particular for metadata and auth/session keys
    Not that the problem is more with metadata as this is a class instance
    and JSON cannot handle that
    So instead we decorate the session object with a UID and retrieve all the rest 
    from the present - singleton - cache instance
    """

    __metaclass__ = Singleton

    def get_auth(self, request):
        """
        Get the auth previously attached to the request's session, or None
        """
        result = self._get(request, 'auth')
        return result

    def store_auth(self, request, auth):
        """
        Store the auth object attached to this request's session
        create that extension if needed
        """
        return self._store(request, 'auth', auth)

    def get_metadata(self, request):
        """
        retrieve metadata attached to this request's session, or None
        """
        return self._get(request, 'metadata')

    def store_metadata(self, request, metadata):
        """
        Store the metadata object attached to this request's session
        create that extension if needed
        """
        return self._store(request, 'metadata', metadata)

    def _get(self, request, key):
        "internal - retrieve key - do not create anything"
        session = request.session
        logger.debug("sessioncache._get_{} session={}".format(key, SessionCache._debug_session(session)))
#        self._debug(request)
        if cache_key not in session:
            return None
        cached_uuid = session[cache_key]
        if cached_uuid not in self:
            return None
        extension = self[cached_uuid]
        return getattr(extension, key)

    def _store(self, request, key, value):
        "internal - set key, attach and create extension if needed"
        session = request.session
        if cache_key not in session:
            session[cache_key] = uuid.uuid1().int
        cached_uuid = session[cache_key]
        if cached_uuid not in self:
            self[cached_uuid] = _SessionExtension()
        extension = self[cached_uuid]
        setattr(extension, key, value)
        logger.debug("sessioncache._store_{} session={}".format(key, SessionCache._debug_session(session)))
#        self._debug(request)

    def end_session(self, request):
        """
        Clear all data related to this request's session has we are logging out
        This is for garbage collection
        """
        session = request.session
        logger.debug("SessionCache.end_session() {}".format(self._debug_session(session)))
        if cache_key not in session:
            return
        cached_uuid = session[cache_key]
        if cached_uuid in self:
            del self[cached_uuid]

    def _debug(self, request):
        session = request.session
        logger.debug("SessionCache: ---------- with session {}".format(self._debug_session(session)))
        for k,v in self.iteritems():
            logger.debug("SessionCache {} -> {}".format(k,v))
        if cache_key not in session:
            return
        cached_uuid = session[cache_key]
        if cached_uuid not in self:
            return
        extension = self[cached_uuid]
        logger.debug("SessionCache: found extension {}".format(extension))
        logger.debug("SessionCache: ----------")
        
    @staticmethod
    def _debug_session(session):
        result = ""
        result += "{} x {}".format(session, session.keys())
        if cache_key in session:
            result += " <{} = {}>".format(cache_key, session[cache_key])
        return result
