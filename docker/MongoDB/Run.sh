#!/bin/bash
docker run \
  -d \
  -p 27017:27017 \
  --volumes-from data \
  --name mongo \
  mylibrary/mongo
