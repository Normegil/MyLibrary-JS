var bunyan = require('bunyan');
var logger = bunyan.createLogger({
	name: 'mylibrary',
	src: true,
	streams: [
		{
			level: 'info',
			stream: process.stdout
		}, {
			level: 'trace',
			path: 'logs/node-server/mylibrary-full.log.json'
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
