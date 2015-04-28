FROM mylibrary/node:latest

EXPOSE 8081

RUN npm install mongo-express
WORKDIR /node_modules/mongo-express/
RUN sed \ 
	-e 's|localhost|mongo|' \
	-e 's|useBasicAuth: true|useBasicAuth: false|' \
	-e "s|database: 'test'|database: 'mylibrary'|" \
	-e "s|username: 'user'|username: ''|" \
	-e "s|password: 'pass'|password: ''|" \
	config.default.js \
	> config.js

CMD [ "npm", "start" ]