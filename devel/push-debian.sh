#!/bin/bash
DIR=$(dirname $0)

host=debian03.pl.sophia.inria.fr

rsync -a "$@" $DIR/ root@$host:/root/myslice/
