import os
from django.conf import settings
from django.utils.datastructures import SortedDict
from django.contrib.staticfiles.finders import BaseFinder, FileSystemFinder
from django.core.files.storage import FileSystemStorage

class PluginFinder(FileSystemFinder):
    """
    A static files finder that looks in the directory of each plugin as
    specified in the source_dir attribute of the given storage class.
    """
    def __init__(self, *args, **kwargs):
        # The list of plugins that are handled
        self.locations = []
        # Mapping of plugin module paths to storage instances
        self.storages = SortedDict()
        plugins_dir = self.get_immediate_subdirs(settings.PLUGIN_DIR)
        for root in plugins_dir:
            if not os.path.exists(root) or not os.path.isdir(root):
                continue
            if ('', root) not in self.locations:
                self.locations.append(('', root))
        for _, root in self.locations:
            filesystem_storage = FileSystemStorage(location=root)
            filesystem_storage.prefix = ''
            self.storages[root] = filesystem_storage

    def get_immediate_subdirs(self, dir):
        return [os.path.join(dir, name, 'static') for name in os.listdir(dir) 
                if os.path.isdir(os.path.join(dir, name))]

class ThirdPartyFinder(BaseFinder):
    """
    A static files inder that looks in the directory of each third-party
    resources and tries to preserve the location of each file
    """
    # third-party/MODULE/path/to/js
    extensions = {
        # PREFIX : EXTENSIONS
        ''   : ('.html',),
        'js' : ('.js',),
        'css': ('.css',),
        'img': ('.png', '.ico',),
    }

    def find(self, search_path, all=False):
        """
        Given a relative file path this ought to find an
        absolute file path.

        If the ``all`` parameter is ``False`` (default) only
        the first found file path will be returned; if set
        to ``True`` a list of all found files paths is returned.
        """
        matches = []
        #all_extensions = reduce(lambda x,y : x + y, extensions.values())

        for (path, dirs, files) in os.walk(settings.THIRDPARTY_DIR):
            for file in files:
                name, extension = os.path.splitext(file)

                for type, extensions in self.extensions.items():
                    if not extension in extensions:
                        continue
                    if search_path == os.path.join(type, file):
                        matched_path = os.path.join(path, file) 
                        if not all:
                            return matched_path
                        matches.append(matched_path)
        return matches

    def list(self, ignore_patterns):
        """
        Given an optional list of paths to ignore, this should return
        a two item iterable consisting of the relative path and storage
        instance.
        """
        for (path, dirs, files) in os.walk(settings.THIRDPARTY_DIR):
            for file in files:
                name, extension = os.path.splitext(file)

                for type, extensions in self.extensions.items():
                    if not extension in extensions:
                        continue
                    filesystem_storage = FileSystemStorage(location=path)
                    filesystem_storage.prefix = type
                    yield file, filesystem_storage

class BaseFinder(object):
    """
    A base file finder to be used for custom staticfiles finder classes.
    """

    def list(self, ignore_patterns):
        """
        Given an optional list of paths to ignore, this should return
        a two item iterable consisting of the relative path and storage
        instance.
        """
        raise NotImplementedError()

