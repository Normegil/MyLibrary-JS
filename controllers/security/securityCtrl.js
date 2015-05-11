var jwt = require('jsonwebtoken');
var async = require('async');
var log = require('../../logger.js');
var config = require('../../config.js');
var User = require('../../models/user')
var Group = require('../../models/group')
var authenticator = require('../../helpers/security/authentication.js');
var authorization = require('../../helpers/security/authorization.js');
var errorCtrl = require('../errorCtrl.js');
var requestHelper = require('../../helpers/request.js');

function authenticateAndAuthorize(request, response, next){
	var authorizationHeader = request.get(config.http.header.authentication);
	var tokenHeader = request.get(config.security.token.key.name);
	log.trace('AuthorizationHeader: ' + authorizationHeader);
	log.trace('TokenHeader: ' + tokenHeader);

	getUserFromHeaders(authorizationHeader, tokenHeader, function onLoad(err, user){
		if (err) errorCtrl.handle(response, 50000, err);
		else {
			async.parallel(
				{
					authentication: function(callback){
						authenticate(user, authorizationHeader, tokenHeader, callback);
					},
					authorization: function(callback){
						authorization.checkRights(user, requestHelper.getRequestedResourcePath(request), request.method, callback);
					}
				},
				function onVerified(err, results){
					if (err) errorCtrl.handle(response, 50000, err);
					else if (!results.authentication) errorCtrl.handle(response, 40100, new Error('User ' + user.pseudo + ' fail to authenticate'));
					else if (!results.authorization) errorCtrl.handle(response, 40300, new Error('User ' + user.pseudo + ' not authorized to access resource ' + request.originalUrl + ' with method ' + request.method));
					else next(); // Correct Authentication + Authorization
				}
			);
		}
	});
}

function getUserFromHeaders(authorizationHeader, tokenHeader, callback){
	if (authorizationHeader && authorizationHeader !== '') {
		log.debug('Authentication by Password : ' + user.pseudo);
		getPseudoAndPasswordFromAuthorizationHeader(authorizationHeader, function onDecode(){
			if(err) return callback(err);
			loadUser(userInfo.pseudo, callback);
		});
	} else if (tokenHeader !== null && tokenHeader) {
		log.debug('Authentication by Token : ' + tokenHeader)
		getPseudoFromToken(tokenHeader, function onDecode(err, userInfo){
			if(err) return callback(err);
			loadUser(userInfo.pseudo, callback);
		});
	} else {
		log.trace('Using guest user');
		loadUser('guest', callback);
	}
}

function loadUser(givenPseudo, callback){
	User.findOne({pseudo: givenPseudo}, function onLoad(err, user){
		if(err) return callback(err);
		else if(user === null) return callback(new  Error('User ' + pseudo + ' not found'));
		else return callback(null, user);
	});
}

function authenticate(user, authorizationHeader, tokenHeader, callback){
	if (authorizationHeader && authorizationHeader !== '') {
		log.debug('Authentication by Password : ' + user.pseudo);
		var userFromHeader = getPseudoAndPasswordFromAuthorizationHeader(authorizationHeader, function onDecode(err, userInfo){
			if(err) return callback(err);
			authenticator.authenticateByPassword(user, userInfo.password, callback);
		});
	} else if (tokenHeader !== null && tokenHeader) {
		log.debug('Authentication by Token : ' + tokenHeader)
		authenticator.authenticateToken(user, tokenHeader, callback);
	} else {
		if(user.pseudo === 'guest'){
			return callback(null, true);
		}
		return callback(null, false);
	}
}

function getPseudoAndPasswordFromAuthorizationHeader(authorizationHeader, callback){
	var splittedHeader = authorizationHeader.split(' ');
	if(splittedHeader[0] === 'Basic'){
		var userAndPass = new Buffer(splittedHeader[1], 'base64')
			.toString('utf8')
			.split(';');
		return callback(null, {
			pseudo: userAndPass[0],
			password: userAndPass[1]
		});
	}
	return callback(new Error('Doesn\'t support other authentication method than Basic'));
}

function getPseudoFromToken(tokenHeader, callback){
	var payload = jwt.decode(tokenHeader);
	return callback(null, {
		pseudo: payload.iss
	});
}

module.exports.authenticateAndAuthorize = authenticateAndAuthorize;
