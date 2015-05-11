#!/bin/bash
docker run \
  -d \
  -p 8081:8081 \
  --link mongo:mongo \
  --volumes-from data \
  --name mongo-express \
  mylibrary/mongo-express
