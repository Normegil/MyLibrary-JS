'use strict';
var FluentLogger = require('fluent-logger-stream');
var config = requireModule('config');
var mainLogger = require('./main.js');

function createChildLogger(main, tag) {
  var fluentLogger = new FluentLogger({
    tag: 'mylibrary.' + tag,
    type: config.log.server.transmissionType,
    host: config.log.server.host,
    port: config.log.server.port,
  });
  return mainLogger.child({streams:
      [
        {stream: fluentLogger, level: 'trace'},
      ],
  });
}

module.exports = mainLogger;
module.exports.init = createChildLogger(mainLogger, 'init');
module.exports.security = createChildLogger(mainLogger, 'security');
module.exports.rest = createChildLogger(mainLogger, 'rest');
module.exports.generator = createChildLogger(mainLogger, 'generator');
