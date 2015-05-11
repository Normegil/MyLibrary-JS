#!/bin/bash
docker run \
	-e "GENERATOR_ADMINISTRATOR_ENABLED=false" \
	-e "GENERATOR_MODERATOR_ENABLED=false" \
	-e "GENERATOR_USER_ENABLED=false" \
	-e "GENERATOR_MANGA_ENABLED=true" \
	-e "GENERATOR_MANGA_NUMBER=1000" \
	--link mongo:mongo \
	--volumes-from data \
	--name test-data-generator-manga \
	mylibrary-test/data-generator
