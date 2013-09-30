#!/bin/bash
DIRNAME=$(dirname $0)
cd $DIRNAME/..

# default port : if hostname starts with z -> use 8080 ; otherwise take 80
hostname | grep -q '^z' && port=8080 || port=80
[[ -n "$@" ]] && port=$1

while true; do 
    # we use make for convenience
    # but what the static target really does is to invoke manage.py collectstatic 
    make static templates

    # if port is already used, we kill the server
    pid=$(netstat -putan | awk "\$4 == \"0.0.0.0:$port\" && \$7 != \"-\" {split(\$7,a,\"/\"); print a[1]}")
    [[ -n "$pid" ]] && kill $pid
    
    ./manage.py runserver 0.0.0.0:$port
	sleep 1
done
