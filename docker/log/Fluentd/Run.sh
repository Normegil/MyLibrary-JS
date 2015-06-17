#!/bin/bash
docker run \
  -d \
  --volumes-from data \
  --name log-fluentd \
  mylibrary-log/fluentd
