'use strict';

var async = require('async');
var config = require('../config.js');
var log = require('../logger.js');
var routes = require('../routes');
var User = require('../models/user.js');
var Key = require('../models/key.js');
var passwordHelper = require('./security/password.js');
var keyManager = require('./security/keyManager.js');

function init(baseRestPath, callback){
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
		log.info('Initialization complete');
		return callback();
	});
}

function keysGeneration(callback){
	var keyOptions = config.security.token.key;
	Key.findOne({ name: keyOptions.name }, function onLoad(err, key){
		if (err) return callback(err);
		if (key !== null) {
			return callback(null, true);
		} else {
			keyManager.generateKey(config.security.token.key, function onGenerated(err, key){
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
	User.findOne({pseudo: 'guest'}, function checkUser(error, user){
		if (error)	return callback(error);
		var guestNotExisting = !user || user === null;
		if (guestNotExisting) {
			generateGuest(baseRestPath, callback);
		} else {
			return callback(null, true);
		}
	});
}

function generateGuest(baseRestPath, callback){
	var guest = new User();
	guest.pseudo = 'guest';
	passwordHelper.getHash(guest.pseudo, function assignHashAndAccessRights(err, hash){
		if (err)	return callback(err);
		guest.hashedPassword=hash;
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
	user.access = [];
	var routesList = routes.getRoutesList();
	for(var i=0;i<routesList.length;i++){
		user.access.push({
			path: baseRestPath + routesList[i],
			method: 'GET'
		});
	}
	return callback(null, user);
}

module.exports = init;
