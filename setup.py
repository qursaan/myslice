#!/usr/bin/python
#
# Setup script for myslice
#
# Thierry Parmentelat <thierry.parmentelat@inria.fr>
# INRIA (c) 2013

import os.path
from glob import glob
from distutils.core import setup

# we don't have a final list os let's keep it simple for now
packages= [ os.path.dirname(init) for init in (glob("*/__init__.py")+glob("*/*/__init__.py")) ]

setup(packages = packages,
      scripts = [],
      data_files = [ 
#        ( dir [ list of paths from toplevel] ) ,
        ])
