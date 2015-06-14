#!/bin/bash
docker run \
  -d \
  -p 8081:8081 \
  --link mongo:mongo \
  --name mongo-express \
  mylibrary/mongo-express
