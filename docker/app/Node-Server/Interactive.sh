#!/bin/bash
docker run \
	-it \
	--rm \
	-p 8080:8080\
	--link log-fluentd:fluentd \
	--link mongo:mongo \
	--volumes-from data \
	mylibrary/node-server \
	bash
