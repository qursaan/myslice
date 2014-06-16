#!/bin/bash

if [ $# -eq 1  ] ; then
	curl localhost:8080/sla-service/enforcements/agreement0$1/stop -X PUT
else
	curl localhost:8080/sla-service/enforcements/agreement03/stop -X PUT
	curl localhost:8080/sla-service/enforcements/agreement04/stop -X PUT
fi

