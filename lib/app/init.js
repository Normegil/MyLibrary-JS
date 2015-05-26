'use strict';

var async = require('async');
var u = require('underscore');

var h = requireModule('helper');
var config = requireModule('config');
var log = requireModule('logger');
var routing = requireModule('routing');
var models = requireModule('models');
var security = requireModule('security');

var Key = models.Key;
var User = models.User;

function init(baseRestPath, callback){
	log.info('Initialization - Start');
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
		log.info('Initialization - Done');
		return callback();
	});
}

function keysGeneration(callback){
	var keyOptions = config.security.token.key;
	Key.findOne({ name: keyOptions.name }, function onLoad(err, key){
		if (err) return callback(err);
		if (h.exist(key)) {
			return callback(null, true);
		} else {
			security.generateKey(config.security.token.key, function onGenerated(err, key){
				if(err) return callback(err);
				key.save(function onSave(err){
					if (err) return callback(err);
					return callback(null, true);
				});
			});
		};
	});
}

function userGroupInitialisation(baseRestPath, callback){
	User.findOne({pseudo: config.security.guest.pseudo}, function onLoad(error, user){
		if (error)	return callback(error);
		if (h.exist(user)) {
			log.info('User ' + config.security.guest.pseudo + ' existing');
			return callback(null, true);
		} else {
			generateGuest(baseRestPath, callback);
		}
	});
}

function generateGuest(baseRestPath, callback){
	log.info("Creating GUEST user");
	var guest = new User();
	guest.pseudo = config.security.guest.pseudo;
	security.getPasswordHash(guest.pseudo, function assignHashAndAccessRights(err, hash){
		if (err)	return callback(err);
		guest.hashedPassword = hash;
		generateAccess(guest, baseRestPath, function saveUser(err, user) {
			if(err) return callback(err);
			user.save(function(err){
				if (err) return callback(err);
				return callback(null, true);
			});
		});
	});
}

function generateAccess(user, baseRestPath, callback){
	var routesList = routing.getRoutesList();
	user.access = u.map(routesList, function(route){
		return {
			path: baseRestPath + route	,
			method: 'GET'
		}
	});

	user.access.push({
		path: '/',
		method: 'GET'
	});

	return callback(null, user);
}

module.exports = init;
