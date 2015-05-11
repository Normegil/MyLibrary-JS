'use strict';

var async = require('async');
var config = require('../config.js');
var log = require('../logger.js');
var User = require('../models/user.js');
var Key = require('../models/key.js');
var passwordHelper = require('./security/password.js');
var keyManager = require('./security/keyManager.js');

function init(callback){
	async.series([
		function(callback){
			keysGeneration(callback);
		},
		function(callback){
			userGroupInitialisation(callback);
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

function userGroupInitialisation(callback){
	User.findOne({pseudo: 'guest'}, function checkUser(error, user){
		if (error)	return callback(error);
		var guestNotExisting = !user || user === null;
		if (guestNotExisting) {
			generateGuest(callback);
		} else {
			return callback(null, true);
		}
	});
}

function generateGuest(callback){
	var guest = new User();
	guest.pseudo = 'guest';
	passwordHelper.getHash(guest.pseudo, function assignHashAndAccessRights(err, hash){
		if (err)	return callback(err);
		guest.hashedPassword=hash;
		generateAccess(guest, function saveUser(err, user) {
			if(err) return callback(err);
			user.save(function(err){
				if (err) return callback(err);
				return callback(null, true);
			});
		});
	});
}

function generateAccess(user, callback){
	user.access = [];
	user.access.push({
		path:'/',
		method:'GET'
	});
	user.access.push({
		path:'/rest/mangas',
		method:'GET'
	});
	return callback(null, user);
}

module.exports = init;
