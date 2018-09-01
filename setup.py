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

# Avoid troubles : clean /usr/share/unfold/
#shutil.rmtree('/usr/share/unfold/')

def images (dir):
    return glob( dir+"/*.png") + glob ( dir+"/*.gif")
def javascript (dir):
    return glob( dir+"/*.js")
def stylesheets (dir):
    return glob( dir+"/*.css")

# looks like data_files requires actual files and cannot cope with 
# a whole subdir like we have for fonts
# returns a list of tuples suitable to add to data_files
from operator import add

def scan_fonts (install_topdir, topdir, extensions):
    def subdir_tuples (subdir, extensions):
        return [ (install_topdir+subdir, glob (subdir+"/*.%s"%extension), ) 
                 for extension in extensions 
                 if glob(subdir+"/*.%s"%extension)
             ]
    def subdirs (topdir):
        return [x[0] for x in os.walk(topdir)]
    return reduce (add, [ subdir_tuples (subdir, extensions) for subdir in subdirs(topdir) ] )

fonts_tuples = scan_fonts ('/usr/share/unfold/static/fonts', 
                           'static/fonts',
                           ('otf','eot','svg','ttf','woff'))

setup(packages = packages,
      # xxx somehow this does not seem to show up in debian packaging
      scripts = [ 'apache/unfold-init-ssl.sh' ],
      data_files = [ 
          ( '/usr/share/unfold/static/js', javascript('static/js')),
          ( '/usr/share/unfold/static/css', stylesheets ('static/css')),
          ( '/usr/share/unfold/static/img', images ('static/img')),
# for portal/          
          ( '/usr/share/unfold/static/img/institutions', images ('static/img/institutions')),
          ( '/usr/share/unfold/static/img/testbeds', images ('static/img/testbeds')),
          ( '/usr/share/unfold/templates', glob ('templates/*')),
          ( 'apache', [ 'apache/unfold.conf', 'apache/unfold-ssl.conf', 'apache/unfold.wsgi' ]),
          ( '/etc/unfold/trusted_roots', []),
          ( '/var/unfold', []),
        ] + fonts_tuples )
