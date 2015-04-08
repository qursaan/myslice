from __future__ import print_function

import os
from django.conf import settings
from django.utils.datastructures import SortedDict
from django.contrib.staticfiles.finders import BaseFinder, FileSystemFinder
from django.core.files.storage import FileSystemStorage

# DEPRECATED # # http://nicks-liquid-soapbox.blogspot.fr/2011/03/splitting-path-to-list-in-python.html
# DEPRECATED # def splitpath(path, maxdepth=20):
# DEPRECATED #      ( head, tail ) = os.path.split(path)
# DEPRECATED #      return splitpath(head, maxdepth - 1) + [ tail ] \
# DEPRECATED #          if maxdepth and head and head != path \
# DEPRECATED #          else [ head or tail ]

# The plugin finder is responsible for collecting JS, CSS and PNG files from
# the plugins, which are not declared in the myslice.settings file unlike
# applications.
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

# as these are a django-specific notion
class ThirdPartyFinder(BaseFinder):
    """
    A static files finder that looks in the directory of each third-party
    resources and tries to preserve the location of each file
    """
    # third-party/MODULE/path/to/js
    extensions = {
        # PREFIX : EXTENSIONS
# third party stuff is not expected to provide templates,
#        ''   : ('.html',),
        'js' : ('.js',),
        'css': ('.css',),
        'img': ('.png', '.ico',),
        'fonts' : ('.svg', '.eot', '.ttf', '.woff'),
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
                        print('ThirdPartyFinder, adding',matched_path)
                        matches.append(matched_path)
        return matches

    def list(self, ignore_patterns):
        """
        Given an optional list of paths to ignore, this should return
        a two item iterable consisting of the relative path and storage
        instance.
        """

        for component in os.listdir(settings.THIRDPARTY_DIR):
            # We are looking forward symlinks only
            component_path = os.path.join(settings.THIRDPARTY_DIR, component)
            if not os.path.islink(component_path) or not os.path.isdir(component_path):
                continue
                
            for (path, dirs, files) in os.walk(component_path):
                for file in files:
                    name, extension = os.path.splitext(file)

                    for type, extensions in self.extensions.items():
                        if not extension in extensions:
                            continue
                        filesystem_storage = FileSystemStorage(location=path)
                        filesystem_storage.prefix = type
                        yield file, filesystem_storage
            
# DEPRECATED #         for (path, dirs, files) in os.walk(settings.THIRDPARTY_DIR):
# DEPRECATED #             component_path = path[len(settings.THIRDPARTY_DIR)+1:]
# DEPRECATED #             component_name = splitpath(component_path)[0]
# DEPRECATED #             print "PATH", path, " -- COMPONENT", component_name
# DEPRECATED #             if not os.path.islink(os.path.join(path, component_name)):
# DEPRECATED #                 print "IGNORED", component_name
# DEPRECATED #                 continue
# DEPRECATED #             print "COMPONENT ADDED: ", component_name
# DEPRECATED #             print "=="
# DEPRECATED # 
# DEPRECATED # 
# DEPRECATED #             for file in files:
# DEPRECATED #                 name, extension = os.path.splitext(file)
# DEPRECATED # 
# DEPRECATED #                 for type, extensions in self.extensions.items():
# DEPRECATED #                     if not extension in extensions:
# DEPRECATED #                         continue
# DEPRECATED #                     filesystem_storage = FileSystemStorage(location=path)
# DEPRECATED #                     filesystem_storage.prefix = type
# DEPRECATED #                     yield file, filesystem_storage

# XXX I commented this since it should be imported from django.contrib.staticfiles.finders -- jordan
 
#class BaseFinder(object):
#    """
#    A base file finder to be used for custom staticfiles finder classes.
#    """
#
#    def list(self, ignore_patterns):
#        """
#        Given an optional list of paths to ignore, this should return
#        a two item iterable consisting of the relative path and storage
#        instance.
#        """
#        raise NotImplementedError()

