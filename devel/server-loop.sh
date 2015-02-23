#!/bin/bash
DIRNAME=$(dirname $0)
cd $DIRNAME/..

# default port : if hostname starts with z or with srv- -> use 8000 ; otherwise take 80
hostname | egrep -q '^(z|srv-)' && port=8000 || port=80
[[ -n "$@" ]] && port=$1

while true; do 
    # we use make for convenience
    # but what the static target really does is to invoke manage.py collectstatic 
    make static templates
    ./manage.py runserver 0.0.0.0:$port
	sleep 1
done
