FROM mylibrary/base:latest

RUN curl -sL https://deb.nodesource.com/setup | bash -

RUN apt-get install -y nodejs \
	npm

RUN npm install -g \
		forever \
		node-inspector
