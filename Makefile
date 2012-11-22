all: tags

force:

# in general it's right to rely on the contents as reported by git
tags: force
	git ls-files | xargs etags

# however sometimes we have stuff not yet added, so in this case
ftags: force
	find . -type f | fgrep -v '/.git/' | xargs etags

static: force
	./manage.py collectstatic --noinput 

clean-static: force
	rm -rf ./all-static/
