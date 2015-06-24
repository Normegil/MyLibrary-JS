'use strict';

var async = require('async');
var u = require('underscore');

var h = requireModule('helper');
var config = requireModule('config');
var routing = requireModule('routing');
var models = requireModule('models');
var security = requireModule('security');
var logModule = requireModule('logger');
var initLog = logModule.init;
var secLog = logModule.security;

var Key = models.Key;
var User = models.User;

function init(baseRestPath, callback){
	initLog.info('Initialization - Start');
	async.series([
		function(callback){
			keysGeneration(callback);
		},
		function(callback){
			userGroupInitialisation(baseRestPath, callback);
		}
	],
	function onInitialized(err, results){
		if(err) return callback(err);
		initLog.info('Initialization - Done');
		return callback();
	});
}

function keysGeneration(callback){
	var keyOptions = config.security.token.key;
	Key.findOne({ name: keyOptions.name }, function onLoad(err, key){
		if (err) {
			initLog.error({keyOptions: keyOptions}, 'Error while trying to find key: ' + keyOptions.name);
			return callback(err);
		}
		if (h.exist(key)) {
			secLog.debug({keyOptions: keyOptions}, 'Security key existing - Skipping generation');
			return callback(null, true);
		} else {
			security.generateKey(keyOptions, function onGenerated(err, key){
				if(err) {
					initLog.error({keyOptions: keyOptions}, 'Error while generating key');
					return callback(err);
				}
				secLog.debug({keyOptions: keyOptions}, 'Saving key to database: ' + keyOptions.name);
				key.save(function onSave(err){
					if (err) {
						initLog.error({keyOptions: keyOptions}, 'Error while saving key: ' + keyOptions.name);
						return callback(err);
					}
					secLog.debug({keyOptions: keyOptions}, 'Key saved database: ' + config.security.token.key.name);
					return callback(null, true);
				});
			});
		};
	});
}

function userGroupInitialisation(baseRestPath, callback){
	var guestPseudo = config.security.guest.pseudo;
	initLog.debug({guest: guestPseudo}, 'Checking if guest user exists')
	User.findOne({pseudo: guestPseudo}, function onLoad(error, user){
		if (error) {
			initLog.error({pseudo: guestPseudo}, 'Error when trying to find guest user');
			return callback(error)
		};
		if (h.exist(user)) {
			initLog.debug('Guest user ' + guestPseudo + ' existing');
			return callback(null, true);
		} else {
			generateGuest(guestPseudo, baseRestPath, callback);
		}
	});
}

function generateGuest(guestPseudo, baseRestPath, callback){
	initLog.debug({pseudo: guestPseudo, basePath: baseRestPath}, 'Creating guest user');
	var guest = new User();
	initLog.debug('Generating hashed password for guest user');
	security.getPasswordHash(guestPseudo, function assignHashAndAccessRights(err, hash){
		if (err) {
			initLog.error('Error when generating guest user hash');
			return callback(err);
		}
		initLog.debug('Guest user\'s hashed password generated');
		guest.hashedPassword = hash;
		generateAccess(guest, baseRestPath, function saveUser(err, user) {
			if(err) {
				initLog.error('Error when generating guest access rights');
				return callback(err);
			}
			user.save(function(err){
				if (err) {
					initLog.error('Error when saving guest user: ' + guestPseudo);
					return callback(err);
				}
				initLog.debug('Guest user saved: ' + guestPseudo);
				return callback(null, true);
			});
		});
	});
}

function generateAccess(user, baseRestPath, callback){
	initLog.debug({basePath: baseRestPath}, 'Generating guest user accessRights');
	var routesList = routing.getRoutesList();
	user.access = u.map(routesList, function(route){
		return {
			path: baseRestPath + route,
			method: 'GET'
		}
	});
	user.access.push({
		path: '/',
		method: 'GET'
	});
	initLog.debug({accessRights: user.access}, 'Guest user\'s access rights generated');
	return callback(null, user);
}

module.exports = init;
