var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keyManager = require('./keyManager.js');
var passwordHelper = require('./password.js');
var User = require('../../models/user.js');
var config = require('../../config.js');
var log = require('../../logger.js');

function authenticatePassword(user, sentPassword, callback){
	log.debug('User identified by AuthorizationHeader' + userPseudo);
	passwordHelper.check(sentPassword, user.hashPassword,
		function executeCallback(err, result) {
			return callback(err, result);
		}
	);
}

function authenticateToken(user, token, callback){
	keyManager.load(config.security.token.key.name, function checkTokenValidity(err, key){
		if (err) return callback(err);
		jwt.verify(token, key.public, function sendTokenValidationResult(err, payload){
			if (err)	return callback(null, false);
			return callback(null, true);
		});
	});
}

module.exports.authenticatePassword = authenticatePassword;
module.exports.authenticateToken = authenticateToken;
