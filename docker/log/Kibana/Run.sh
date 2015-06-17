#!/bin/bash
docker run \
	-d \
	-p 5601:5601 \
	--link log-elastic:elasticsearch \
	--name log-kibana \
	kibana
