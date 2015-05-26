'use strict';

var bcrypt = require('bcryptjs');

var log = requireModule('logger');
var config = requireModule('config');

function getHash(password, callback){
	bcrypt.genSalt(config.security.password.bcryptIterations, function generateHash(err, salt) {
		if (err) return callback(err);
		bcrypt.hash(password, salt, function useHash(err, hash) {
			if(err) return callback(err);
			return callback(null, hash);
		});
	});
}

function check(password, hash, callback){
	bcrypt.compare(password, hash, callback);
}

module.exports.check = check;
module.exports.getHash = getHash;
