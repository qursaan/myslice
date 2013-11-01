#!/usr/bin/python
#
# Setup script for myslice
#
# Thierry Parmentelat <thierry.parmentelat@inria.fr>
# INRIA (c) 2013

import os.path
from glob import glob
from distutils.core import setup

# we don't have a final list so let's keep it simple for now
packages= [ os.path.dirname(init) for init in (glob("*/__init__.py")+glob("*/*/__init__.py")) ]

setup(packages = packages,
      scripts = [ 'apache/unfold-init-ssl.sh' ],
      data_files = [ 
        ( 'static/js', glob ('static/js/*')),
        ( 'static/css', glob ('static/css/*')),
        ( 'static/img', glob ('static/img/*')),
        ( 'static/fonts', glob ('static/fonts/*')),
        ( 'templates', glob ('templates/*')),
        ( 'apache', [ 'apache/myslice.conf' ]),
        ])
