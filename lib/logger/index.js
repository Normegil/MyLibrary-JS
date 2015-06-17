var bunyan = require('bunyan');
var FluentLogger = require('fluent-logger-stream');

console.log("FLUENTD Server - " + process.env.LOGSERVER_HOST + ':' + process.env.LOGSERVER_PORT);
var fluentLogger = new FluentLogger({
	tag: 'debug.mylibrary',
	type: 'forward',
	host: process.env.LOGSERVER_HOST || 'localhost',
	port: process.env.LOGSERVER_PORT || '2000'
});

var logger = bunyan.createLogger({
	name: 'mylibrary',
	src: true,
	streams: [
		{
			stream: process.stdout,
			level: 'info'
		}, {
			path: 'logs/node-server/mylibrary-full.log.json',
			level: 'trace'
		}, {
			stream: fluentLogger,
			level: 'trace'
		}
	],
	serializers: bunyan.stdSerializers
});
logger.on('error', function handleLoggerErrors(err, stream){
	if(err){
		console.log(err);
	}
});

module.exports = logger;
