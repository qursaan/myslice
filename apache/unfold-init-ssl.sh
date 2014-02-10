#!/bin/bash

COMMAND=$(basename $0)

# minimal script for initializing SSL material for myslice
# you probably want to take care of this yourself instead,
# but until somebody gets around to that apache will at least start up
# 
trusted_roots=/etc/unfold/trusted_roots
key=/etc/unfold/myslice.key
cert=/etc/unfold/myslice.cert

# provide a hostname as the first arg to this command 
# (otherwise we use hostname)
if [[ -n "$@" ]] ; then hostname=$1; shift; else hostname=$(hostname); fi

function init_trusted_roots () {
    if [ ! -d $trusted_roots ] ; then
	echo "Creating empty" $trusted_roots
	mkdir -p $trusted_roots
	echo "You will wish to populate that with e.g. ple.gid or the like"
	echo "Make sure to re-run this command $COMMAND if you add gids"
    fi
    ### c_rehash will consider only files ending in .pem or .crt
    # so, we create symlinks from *.gid to *.pem
    pushd $trusted_roots >& /dev/null
    for gid in *.gid; do
	base=$(basename $gid .gid)
	pem=$base.pem
	[ -f $pem ] && ln -s $gid $pem 
    done
    ### invoke c_rehash 
    # on debian c_rehash comes with openssl
    # on fedora this is part of openssl-perl
    echo -n "Invoking c_rehash in $(pwd) .. "; c_rehash .
    popd  >& /dev/null
}

function init_server_cert () {
    # both present : we have nothing to do
    [ -f $key -a -f $cert ] && return
    # exactly one present : we have a problem
    [ -f $key -o -f $cert ] && { echo "server key or cert missing ?!?" ; return ; }
    # create both
    echo "Creating server key and cert for hostname ${hostname}"
    openssl req -new -x509 -days 365 -set_serial $RANDOM -batch \
	-subj "/CN=${hostname}" -nodes -keyout $key -out $cert
}


function main () {
    init_trusted_roots
    init_server_cert
}

main "$@"
