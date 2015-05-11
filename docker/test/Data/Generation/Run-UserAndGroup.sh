#!/bin/bash
docker run \
	-e "GENERATOR_ADMINISTRATOR_ENABLED=true" \
	-e "GENERATOR_MODERATOR_ENABLED=true" \
	-e "GENERATOR_USER_ENABLED=true" \
	-e "GENERATOR_MANGA_ENABLED=false" \
	-e "GENERATOR_ADMINISTRATOR_SIZE=1" \
	-e "GENERATOR_MODERATOR_SIZE=10" \
	-e "GENERATOR_USER_SIZE=100" \
	--link mongo:mongo \
	--volumes-from data \
	--name test-data-generator-userAndGroup \
	mylibrary-test/data-generator
