'use strict';
var jwt = require('jsonwebtoken');
var keyManager = require('../keyManager.js');
var passwordHelper = require('../password.js');
var config = requireModule('config');

function authenticatePassword(user, sentPassword, callback){
	passwordHelper.check(sentPassword, user.hashPassword,
		function executeCallback(err, result) {
			return callback(err, result);
		}
	);
}

function authenticateToken(user, token, callback){
	keyManager.load(config.security.token.key.name, function checkTokenValidity(err, key){
		if (err) { return callback(err); }
		jwt.verify(token, key.public, function sendTokenValidationResult(err){
			if (err) { return callback(null, false); }
			return callback(null, true);
		});
	});
}

module.exports.authenticatePassword = authenticatePassword;
module.exports.authenticateToken = authenticateToken;
