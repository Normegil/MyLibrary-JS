var async = require('async');
var log = require('../../logger.js');
var config = require('../../config.js');
var routes = require('../../routes');
var testConfig = require('../testConfig.js');
var group = require('./helpers/group.js');
var book = require('./helpers/book.js');
require('mongoose').connect(config.databaseURL);

function generateBooks(callback){
	if(testConfig.data.generation.books.enabled){
		book.generate(testConfig.data.generation.books.size, callback);
	}else{
		callback(null, false);
	}
}

function generateAdministrators(paths, methods, callback){
	if(testConfig.data.generation.administrators.enabled){
		group.generate('administrators', testConfig.data.generation.administrators.size, function(group, onAccessGenerated){
			group.access = [];
			for(var i = 0;i<paths.length;i++){
				for(var j = 0;j<methods.length;j++){
					group.access.push({
						path:paths[i],
						method:methods[j]
					});
				}
			}
			onAccessGenerated(callback);
		});
	}else{
		callback(null, false);
	}
}

function generateModerators(paths, methods, callback){
	if(testConfig.data.generation.moderators.enabled){
		group.generate('moderators', testConfig.data.generation.moderators.size, function(group, onAccessGenerated){
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
			onAccessGenerated(callback);
		});
	}else{
		callback(null, false);
	}
}

function generateUsers(paths, methods, callback){
	if(testConfig.data.generation.users.enabled){
		group.generate('users', testConfig.data.generation.users.size, function(group, onAccessGenerated){
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
			onAccessGenerated(callback);
		});
	}else{
		callback(null, false);
	}
};

var paths = routes.getRoutesList();
var methods = [
	'GET',
	'POST',
	'PUT',
	'DELETE'
];

async.parallel(
	{
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
	},
	function onFinished(err, results){
		if(err) log.error(err);
		else {
			log.info('Generation finished');
			process.exit();
		}
	}
);
