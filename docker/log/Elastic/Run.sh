#!/bin/bash
docker run \
  -d \
  --volumes-from data \
  --name log-elastic \
  elasticsearch
