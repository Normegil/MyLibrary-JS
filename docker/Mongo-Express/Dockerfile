FROM mylibrary/node:latest

EXPOSE 8081

RUN npm install mongo-express
WORKDIR /node_modules/mongo-express/
RUN sed 's|localhost|mongo|' config.default.js \
	> config.js

CMD [ "npm", "start" ]