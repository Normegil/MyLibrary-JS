'use strict';
var crypto = require('crypto');
var h = requireModule('helper');
var log = requireModule('logger').security;
var Key = requireModule('models').Key;

function get(keyName, callback){
	log.debug('Accessing key :"' + keyName + '"');
	Key.findOne({ name: keyName }, function onLoad(error, key){
		if (error) { return callback(error); }
		else if (!h.exist(key)) { return callback(new Error('Key not found')); }
		else { return callback(null, key); }
	});
}

function generateKey(keyOptions, callback){
	log.info({keyOptions: keyOptions}, 'Generate key \'' + keyOptions.name + '\'');
	var key = new Key();
	key.name = keyOptions.name;
	var diffieHellman = crypto.createDiffieHellman(keyOptions.size);
	diffieHellman.generateKeys();
	key.public = diffieHellman.getPublicKey('base64');
	key.private = diffieHellman.getPrivateKey('base64');
	log.info('Key generated: ' + keyOptions.name);
	return callback(null, key);
}

module.exports.get = get;
module.exports.generateKey = generateKey;
