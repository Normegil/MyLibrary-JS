var password = require('./password.js');
var key = require('./keyManager.js');
var request = require('./request');

module.exports.secure = request.secure;
module.exports.getPasswordHash = password.getHash;
module.exports.generateKey = key.generateKey;
