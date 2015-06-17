#!/bin/bash

#Copy config files
/bin/cp -a /app/docker/log/Fluentd/conf/* /etc/td-agent/

#Start service
/etc/init.d/td-agent start
/etc/init.d/td-agent status

tail -f /var/log/td-agent/td-agent.log
