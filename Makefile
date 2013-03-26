SHELL = /bin/bash

MAKE-SILENT = $(MAKE) --no-print-directory

### first purpose, build and install from the specfile
all: build

force:

DESTDIR := /
datadir := /usr/share
bindir := /usr/bin

PWD := $(shell pwd)

build: static templates
	python setup.py build

install: 
	python setup.py install \
	    --install-purelib=$(DESTDIR)/$(datadir)/myslice \
	    --install-scripts=$(DESTDIR)/$(datadir)/myslice \
	    --install-data=$(DESTDIR)/$(datadir)/myslice


#################### third-party layout is kind of special 
# because we have differents versions, and also we 
# try to preserve the file structure from upstream
# so let's handle this manually
THIRD-PARTY-RESOURCES =
# ignore variants, use the main symlink	third-party/bootstrap
THIRD-PARTY-RESOURCES += $(shell ls third-party/bootstrap/*/*)
# just the single js as identified with a symlink
THIRD-PARTY-RESOURCES += $(shell ls third-party/datatables/js/dataTables.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/datatables/js/dataTables.bootstrap.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/datatables/css/dataTables.bootstrap.css)
# likewise
THIRD-PARTY-RESOURCES += $(shell ls third-party/jquery/js/jquery.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/jquery/js/jquery.min.js)
# for storing the visible status of plugins
THIRD-PARTY-RESOURCES += $(shell ls third-party/jquery-html5storage/jquery.html5storage.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/jquery-html5storage/jquery.html5storage.min.js)
# spin comes in plain or min, + the jquery plugin, and our own settings
THIRD-PARTY-RESOURCES += $(shell ls third-party/spin/*.js)
# used in QueryCode
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/scripts/shCore.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/scripts/shAutoloader.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/scripts/shBrushPython.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/scripts/shBrushRuby.js)
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/styles/shCore.css)
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/styles/shCoreDefault.css)
THIRD-PARTY-RESOURCES += $(shell ls third-party/syntaxhighlighter/styles/shThemeDefault.css)


thirdparty-js:
	@find $(THIRD-PARTY-RESOURCES) -name '*.js'
thirdparty-css:
	@find $(THIRD-PARTY-RESOURCES) -name '*.css'
thirdparty-img:
	@find $(THIRD-PARTY-RESOURCES) -name '*.png' -o -name '*.ico'

# we might have any of these as templates - e.g. ./unfold/templates/plugin-init.js
# so if there's a /templates/ in the path ignore the file
local-js: force
	@find . -type f -name '*.js' | egrep -v '/all-(static|templates)/|/third-party/|/templates/'
local-css: force
	@find . -type f -name '*.css' | egrep -v 'all-(static|templates)/|/third-party/|/templates/'
local-img: force
	@find . -type f -name '*.png' -o -name '*.ico' | egrep -v 'all-(static|templates)/|/third-party/|/templates/'

list-js: thirdparty-js local-js
list-css: thirdparty-css local-css
list-img: thirdparty-img local-img

# having templates in a templates/ subdir is fine most of the time except for plugins
plugins-templates: force
	@find plugins -type f -name '*.html' 
local-templates: force
	@$(foreach tmpl,$(shell find . -name templates),ls -1 $(tmpl)/*;)

list-templates: plugins-templates local-templates

#################### manage static contents (extract from all the modules into the single all-static location)
static run-static static-run: force
	mkdir -p ./all-static/js all-static/css all-static/img
	ln -sf $(foreach x,$(shell $(MAKE-SILENT) list-js),../../$(x)) ./all-static/js
	ln -sf $(foreach x,$(shell $(MAKE-SILENT) list-css),../../$(x)) ./all-static/css
	ln -sf $(foreach x,$(shell $(MAKE-SILENT) list-img),../../$(x)) ./all-static/img

clean-static static-clean: force
	rm -rf ./all-static

all-static: clean-static run-static

#################### manage templates for the plugin area
templates run-templates templates-run: force
	mkdir -p all-templates
	ln -sf $(foreach x,$(shell $(MAKE-SILENT) list-templates),../$(x)) ./all-templates

clean-templates templates-clean: force
	rm -rf ./all-templates

all-templates: clean-templates run-templates

####################
list-all list-resources: list-templates list-js list-css list-img

#################### compute emacs tags
# list files under git but exclude third-party stuff like bootstrap and jquery
myfiles: force
	@git ls-files | egrep -v 'insert(_|-)above|third-party/|play/'

# in general it's right to rely on the contents as reported by git
tags: force
	$(MAKE-SILENT) myfiles | xargs etags

# however sometimes we have stuff not yet added, so in this case
ftags: force
	find . -type f | fgrep -v '/.git/' | xargs etags

#################### sync : push current code on a (devel) box running myslice
SSHURL:=root@$(MYSLICEBOX):/
SSHCOMMAND:=ssh root@$(MYSLICEBOX)

### rsync options
# the config file should probably not be overridden ??
# --exclude settings.py 
LOCAL_RSYNC_EXCLUDES	:= --exclude '*.pyc' --exclude config.py --exclude all-static --exclude all-templates --exclude '*.sqlite3'  --exclude play/ 
# usual excludes
RSYNC_EXCLUDES		:= --exclude .git --exclude '*~' --exclude TAGS --exclude .DS_Store $(LOCAL_RSYNC_EXCLUDES) 
# make -n will propagate as rsync -n 
RSYNC_COND_DRY_RUN	:= $(if $(findstring n,$(MAKEFLAGS)),--dry-run,)
# putting it together
RSYNC			:= rsync -a -v $(RSYNC_COND_DRY_RUN) $(RSYNC_EXCLUDES)

# xxx until we come up with a packaging this is going to be a wild guess
# on debian04 I have stuff in /usr/share/myslice and a symlink in /root/myslice
#INSTALLED=/usr/share/myslice
INSTALLED=/root/myslice

sync:
ifeq (,$(MYSLICEBOX))
	@echo "you need to set MYSLICEBOX, like in e.g."
	@echo "  $(MAKE) MYSLICEBOX=debian04.pl.sophia.inria.fr "$@""
	@exit 1
else
	+$(RSYNC) ./ $(SSHURL)/$(INSTALLED)/
endif

# xxx likewise until we run this under apache it's probably hard to restart from here
restart:
ifeq (,$(MYSLICEBOX))
	@echo "you need to set MYSLICEBOX, like in e.g."
	@echo "  $(MAKE) MYSLICEBOX=debian04.pl.sophia.inria.fr "$@""
	@exit 1
else
	@echo "$@" target not yet implemented - for an apache based depl it would read ...; exit; @$(SSHCOMMAND) /etc/init.d/apache2 restart
endif
