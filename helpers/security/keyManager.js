var crypto = require('crypto');
var log = require('../../logger.js');
var config = require('../../config.js');
var Key = require('../../models/key.js');

function get(keyName, callback){
	log.debug('Accessing key :"' + keyName + '"');
	Key.findOne({ name: keyName }, function onLoad(error, key){
		if (error)	return callback(error);
		if (!key) return callback(new Error('Key not found'));
		return callback(null, key);
	});
};

function generateKey(keyOptions, callback){
	log.info('Generate key \'' + keyOptions.name + '\'');
	var key = new Key();
	key.name = keyOptions.name;
	var diffieHellman = crypto.createDiffieHellman(keyOptions.size);
	diffieHellman.generateKeys();
	key.public = diffieHellman.getPublicKey('base64');
	key.private = diffieHellman.getPrivateKey('base64');
	return callback(null, key);
}

module.exports.get = get;
module.exports.generateKey = generateKey;
