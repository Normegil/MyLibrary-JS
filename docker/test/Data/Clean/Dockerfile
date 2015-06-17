FROM mylibrary-server/node:latest

ENV MONGODB_URI="mongodb://mongo/mylibrary"
ENV LOGSERVER_HOST="fluentd"
ENV LOGSERVER_PORT="2000"
WORKDIR /app

CMD ["node", "clean.js"]
