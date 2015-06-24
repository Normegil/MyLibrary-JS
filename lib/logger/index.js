var mainLogger = require('main.js');
var config = requireModule('config');

function createChildLogger(main, tag){
	var fluentLogger = new FluentLogger({
		tag: 'mylibrary.' + tag,
		type: config.log.server.transmissionType,
		host: config.log.server.host,
		port: config.log.server.port
	});
	return mainLogger.child({streams:[{
		stream: fluentLogger,
		level: 'trace'
	}]});
}

module.exports = mainLogger;
module.exports.error = createChildLogger(mainLogger, 'error');
module.exports.init = createChildLogger(mainLogger, 'init');
module.exports.security = createChildLogger(mainLogger, 'security');
module.exports.request = createChildLogger(mainLogger, 'request');
module.exports.response = createChildLogger(mainLogger, 'response');
