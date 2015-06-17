#!/bin/bash
docker run \
	-e "GENERATOR_ADMINISTRATOR_ENABLED=true" \
	-e "GENERATOR_MODERATOR_ENABLED=true" \
	-e "GENERATOR_USER_ENABLED=true" \
	-e "GENERATOR_MANGA_ENABLED=true" \
	-e "GENERATOR_ADMINISTRATOR_SIZE=1" \
	-e "GENERATOR_MODERATOR_SIZE=10" \
	-e "GENERATOR_USER_SIZE=100" \
	-e "GENERATOR_MANGA_NUMBER=1000" \
	--link mongo:mongo \
	--link log-fluentd:fluentd \
	--volumes-from data \
	--name test-data-generator-full \
	mylibrary-test/data-generator
