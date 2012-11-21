# in general it's right to rely on the contents as reported by git
tags:
	git ls-files | xargs etags

# however sometimes we have stuff not yet added, so in this case
ftags:
	find . -type f | fgrep -v '/.git/' | xargs etags
