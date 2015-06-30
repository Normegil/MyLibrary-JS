'use strict';
var jwt = require('jsonwebtoken');
var async = require('async');
var _ = require('underscore');
var log = requireModule('logger').security;
var config = requireModule('config');
var models = requireModule('models');
var errorCtrl = requireModule('rest').error;
var h = requireModule('helper');
var authorization = require('./authorization.js');
var authenticator = require('./authentication.js');
var requestHelper = h.request;
var User = models.User;

function secure(options, next){
	var request = options.request;
	var response = options.response;
	var whiteList = options.whiteList;
	if(mustBeSecured(request, whiteList)){
		log.info({req: request, whiteList: whiteList}, 'Verifying request');
		var authorizationHeader = request.get(config.http.header.authentication);
		var tokenHeader = request.get(config.security.token.key.name);

		log.debug('Load user based on header');
		getUserFromHeaders(authorizationHeader, tokenHeader, function onLoad(err, user){
			if (err) { errorCtrl.handle(request, response, {code: 50000, error: err}); }
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
						if (err) {
							errorCtrl.handle(request, response, {
								code: 50000,
								error: err
								});
						}else if (!results.authentication) {
							log.warn({authentication: results.authentication}, 'Authentication failed: ' + user.pseudo)
							errorCtrl.handle(request, response, {
								code:40100,
								error: new Error('User ' + user.pseudo + ' fail to authenticate')
								});
						}else if (!results.authorization) {
							log.warn({authorization: results.authorization}, 'Authorization failed: ' + user.pseudo)
							errorCtrl.handle(request, response, {
								code: 40300,
								error: new Error('User ' + user.pseudo + ' not authorized to access resource ' + request.originalUrl + ' with method ' + request.method)
								});
						}else{ return next(); } // Correct Authentication + Authorization
					}
				);
			}
		});
	}else{
		log.info({req: request, whiteList: whiteList}, 'Request whiteListed - Not Verified: ' + request.method + ' - ' + requestHelper.getFullUrl(request));
		next();
	}
}

function mustBeSecured(request, whiteList){
	var resourcePath = requestHelper.getRequestedResourcePath(request);
	var splittedResourcePath = resourcePath.split('/');
	var result = _.find(whiteList, function checkAgainstResource(whiteListElement){
		if(!h.exist(whiteListElement.method) || whiteListElement.method === request.method){
			return _.isEqual(whiteListElement.path, splittedResourcePath.slice(0, whiteListElement.path.length));
		}else{
			return false;
		}
	});

	if(h.exist(result)) {
		return false;
	}else{
		return true;
	}
}

function getUserFromHeaders(authorizationHeader, tokenHeader, callback){
	if (authorizationHeader && authorizationHeader !== '') {
		getPseudoAndPasswordFromAuthorizationHeader(authorizationHeader, function onDecode(err, userInfo){
			if(err) { return callback(err); }
			log.debug({pseuod: userInfo.pseudo}, 'Authentication by Password');
			loadUser(userInfo.pseudo, callback);
		});
	} else if (tokenHeader !== null && tokenHeader) {
		log.debug('Authentication by Token : ' + tokenHeader);
		getPseudoFromToken(tokenHeader, function onDecode(err, userInfo){
			if(err) { return callback(err); }
			loadUser(userInfo.pseudo, callback);
		});
	} else {
		var guestPseudo = config.security.guest.pseudo;
		log.trace({guestPseudo: guestPseudo}, 'Using guest user');
		loadUser(guestPseudo, callback);
	}
}

function loadUser(givenPseudo, callback){
	User.findOne({pseudo: givenPseudo}, function onLoad(err, user){
		if(err) { return callback(err); }
		else if(!h.exist(user)) { return callback(new Error('User ' + givenPseudo + ' not found')); }
		else { return callback(null, user); }
	});
}

function authenticate(options, callback){
	if (h.exist(options.header.authorization) && options.header.authorization !== '') {
		log.debug('Authentication by Password : ' + options.user.pseudo);
		getPseudoAndPasswordFromAuthorizationHeader(options.header.authorization, function onDecode(err, userInfo){
			if(err) { return callback(err); }
			authenticator.authenticateByPassword(options.user, userInfo.password, callback);
		});
	} else if (h.exist(options.header.token)) {
		log.debug('Authentication by Token : ' + options.header.token);
		authenticator.authenticateToken(options.user, options.header.token, callback);
	} else if(options.user.pseudo === config.security.guest.pseudo){
			log.debug('Guest user');
			return callback(null, true);
	}
	return callback(new Error('Authentication Headers not existing and not using guest user'));
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
