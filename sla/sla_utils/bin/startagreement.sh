#!/bin/bash

if [ $# -eq 1  ] ; then
	curl localhost:8080/sla-service/enforcements/agreement0$1/start -X PUT
else
	curl localhost:8080/sla-service/enforcements/agreement03/start -X PUT
	curl localhost:8080/sla-service/enforcements/agreement04/start -X PUT
fi

