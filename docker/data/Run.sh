#!/bin/bash
docker run \
  -d \
  -v /app:/app \
  --name data \
  mylibrary/data
