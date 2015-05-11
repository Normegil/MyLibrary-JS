#!/bin/bash
docker run \
	--link mongo:mongo \
	--volumes-from data \
	--name test-data-clean \
	mylibrary-test/data-clean
