FROM debian:7.8

RUN apt-get update && \
	apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | bash -

RUN apt-get install -y nodejs \
	npm \
	build-essential