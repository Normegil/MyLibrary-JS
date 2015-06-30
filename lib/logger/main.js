'use strict';

var bunyan = require('bunyan');
var FluentLogger = require('fluent-logger-stream');
var config = requireModule('config');

var fluentLogger = new FluentLogger({
	tag: 'mylibrary.main',
	type: config.log.server.transmissionType,
	host: config.log.server.host,
	port: config.log.server.port
});

var logger = bunyan.createLogger({
	name: 'mylibrary',
	src: true,
	streams: [
		{
			stream: process.stdout,
			level: 'info'
		}, {
			path: 'logs/mylibrary/server.trace.log.json',
			level: 'trace'
		}, {
			path: 'logs/mylibrary/server.info.log.json',
			level: 'info'
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
