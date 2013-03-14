#!/bin/bash
DIRNAME=$(dirname $0)
cd $DIRNAME/..

# default port : if hostname starts with z -> use 8080 ; otherwise take 80
hostname | grep -q '^z' && port=8080 || port=80
[[ -n "$@" ]] && port=$1

make all-static all-templates
while true; do 
    ./manage.py runserver 0.0.0.0:$port
    make static templates
done
