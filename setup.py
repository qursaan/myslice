#!/usr/bin/python
#
# Setup script for myslice+unfold
#
# Thierry Parmentelat <thierry.parmentelat@inria.fr>
# INRIA (c) 2013

import os.path
import shutil
from glob import glob
from distutils.core import setup

# we don't have a final list so let's keep it simple for now
packages= [ os.path.dirname(init) for init in (glob("*/__init__.py")+glob("*/*/__init__.py")) ]
print packages

# Avoid troubles : clean /usr/share/unfold/
shutil.rmtree('/usr/share/unfold/')

setup(packages = packages,
      # xxx somehow this does not seem to show up in debian packaging
      scripts = [ 'apache/unfold-init-ssl.sh' ],
      data_files = [ 
          ( '/usr/share/unfold/static/js', glob ('static/js/*')),
          ( '/usr/share/unfold/static/css', glob ('static/css/*')),
          ( '/usr/share/unfold/static/img', glob ('static/img/*')),
          ( '/usr/share/unfold/static/fonts', glob ('static/fonts/*')),
          ( '/usr/share/unfold/templates', glob ('templates/*')),
          ( 'apache', [ 'apache/unfold.conf', 'apache/unfold-ssl.conf', 'apache/unfold.wsgi' ]),
          ( '/etc/unfold/trusted_roots', []),
          ( '/var/unfold', []),
        ])
