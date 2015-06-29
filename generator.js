'use strict';

global.requireModule = function(name){
	return require(__dirname + '/lib/' + name);
};

var async = require('async');
var mongoose = require('mongoose');

var config = requireModule('config');
var routing = requireModule('routing');
var generator = requireModule('generator');
var log = requireModule('logger');

log.info('Connect to MongoDB: ' + config.databaseURL);
mongoose.connect(config.databaseURL);
var generatorConfig = config.generation;

var group = generator.group;
var bookSerie = generator.books;

var paths = routing.getRoutesList();
var methods = [
	'GET',
	'POST',
	'PUT',
	'DELETE'
];

async.parallel({
		administrators: function(callback){
			generateAdministrators(paths, methods, callback);
		},
		moderators: function(callback){
			generateModerators(paths, methods, callback);
		},
		users: function(callback){
			generateUsers(paths, methods, callback);
		},
		book: function(callback){
			generateBooks(callback);
		}
	}, function onFinished(err){
		if(err){
			log.fatal({error: err}, "Error during generation");
			throw err;
		}else{
			log.info('Generation finished');
			process.exit();
		}
	}
);

function generateBooks(callback){
	if(generatorConfig.books.enabled){
		log.info('Generating books');
		bookSerie.generate(generatorConfig.books.size, callback);
	}else{
		log.info('Skipping book generation');
		callback(null, false);
	}
}

function generateUsers(paths, methods, callback){
	if(generatorConfig.users.enabled){
		log.info('Generating users group');
		group.generate('users', generatorConfig.users.size, function(group, onAccessGenerated){
			log.debug('Generating users group access rights');
			group.access = [];
			for(var i = 0;i<paths.length;i++){
				group.access.push({
					path:paths[i],
					method:'GET'
				});
			}
			group.access.push({
				path:'/',
				method:'GET'
			});
			log.debug({accessRights: group.access}, 'Users group access rights generated');
			onAccessGenerated(callback);
		});
	}else{
		log.info('Skipping users group generation');
		return callback(null, false);
	}
}

function generateModerators(paths, methods, callback){
	if(generatorConfig.moderators.enabled){
		log.info('Generating moderators group');
		group.generate('moderators', generatorConfig.moderators.size, function(group, onAccessGenerated){
			log.debug('Generating moderators group access rights');
			group.access = [];
			for(var i = 0;i<paths.length;i++){
				for(var j = 0;j<methods.length;j++){
					if(methods[j] != 'DELETE'){
						group.access.push({
							path:paths[i],
							method:methods[j]
						});
					}
				}
			}
			log.debug({accessRights: group.access}, 'Moderators group access rights generated');
			onAccessGenerated(callback);
		});
	}else{
		log.info('Skipping moderators group generation');
		callback(null, false);
	}
}

function generateAdministrators(paths, methods, callback){
	if(generatorConfig.administrators.enabled){
		log.info('Generating administrators group');
		group.generate('administrators', generatorConfig.administrators.size, function(group, onAccessGenerated){
			log.debug('Generating administrators group access rights');
			group.access = [];
			for(var i = 0;i<paths.length;i++){
				for(var j = 0;j<methods.length;j++){
					group.access.push({
						path:paths[i],
						method:methods[j]
					});
				}
			}
			log.debug({accessRights: group.access}, 'Administrators group access rights generated');
			onAccessGenerated(callback);
		});
	}else{
		log.info('Skipping users administrators generation');
		callback(null, false);
	}
}
