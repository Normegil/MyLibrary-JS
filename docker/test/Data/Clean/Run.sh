#!/bin/bash
docker run \
	--link mongo:mongo \
	--link log-fluentd:fluentd \
	--volumes-from data \
	--name test-data-clean \
	mylibrary-test/data-clean
