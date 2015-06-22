#!/bin/bash
docker run \
  -d \
  --link mongo:mongo \
  --volumes-from data \
  --name log-fluentd \
  mylibrary-log/fluentd
