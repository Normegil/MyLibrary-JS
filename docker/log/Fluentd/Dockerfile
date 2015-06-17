FROM mylibrary/base:latest

EXPOSE 2000

RUN apt-get install -y adduser && \
	curl -L https://td-toolbelt.herokuapp.com/sh/install-debian-wheezy-td-agent2.sh	| sed -e 's|sudo -k||g' -e 's|sudo||g' | sh

CMD ["/bin/bash", "-c", "/app/docker/log/Fluentd/Start.sh"]
