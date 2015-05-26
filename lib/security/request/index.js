var jwt = require('jsonwebtoken');
var async = require('async');
var u = require('underscore');

var log = requireModule('logger');
var config = requireModule('config');
var models = requireModule('models');
var errorCtrl = requireModule('rest').error;
var h = requireModule('helper');

var authorization = require('./authorization.js');
var authenticator = require('./authentication.js');

var requestHelper = h.request;
var User = models.User;
var Group = models.Group;

function secure(request, response, whiteList, next){
	if(mustBeSecured(request, whiteList)){
		var authorizationHeader = request.get(config.http.header.authentication);
		var tokenHeader = request.get(config.security.token.key.name);
		log.trace('AuthorizationHeader: ' + authorizationHeader);
		log.trace('TokenHeader: ' + tokenHeader);

		getUserFromHeaders(authorizationHeader, tokenHeader, function onLoad(err, user){
			if (err) errorCtrl.handle(request, response,  50000, err);
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
						if (err) errorCtrl.handle(request, response, 50000, err);
						else if (!results.authentication) errorCtrl.handle(request, response, 40100, new Error('User ' + user.pseudo + ' fail to authenticate'));
						else if (!results.authorization) errorCtrl.handle(request, response, 40300, new Error('User ' + user.pseudo + ' not authorized to access resource ' + request.originalUrl + ' with method ' + request.method));
						else next(); // Correct Authentication + Authorization
					}
				);
			}
		});
	}else{
		next();
	}
}

function mustBeSecured(request, whiteList){
	var resourcePath = requestHelper.getRequestedResourcePath(request);
	var splittedResourcePath = resourcePath.split('/');
	var result = u.find(whiteList, function checkAgainstResource(whiteListElement){
		if(!h.exist(whiteListElement.method) || whiteListElement.method === request.method){
			return u.isEqual(whiteListElement.path, splittedResourcePath.slice(0, whiteListElement.path.length));
		}else{
			return false;
		}
	})

	if(h.exist(result)) {
		log.info('Request not secured: ' + request.method + ' - ' + requestHelper.getFullUrl(request));
		return false;
	}else{
		return true;
	}
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
		else if(user === null) return callback(new  Error('User ' + givenPseudo + ' not found'));
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

module.exports.secure = secure;
