global.requireModule = function(name){
	return require(__dirname + '/lib/' + name);
};

var async = require('async');
var mongoose = require('mongoose');

var log = requireModule('logger');
var config = requireModule('config');
var routing = requireModule('routing');
var generator = requireModule('generator');

mongoose.connect(config.databaseURL);
var generatorConfig = config.generation;

var group = generator.group;
var bookSerie = generator.books;

function generateBooks(callback){
	if(generatorConfig.books.enabled){
		bookSerie.generate(generatorConfig.books.size, callback);
	}else{
		callback(null, false);
	}
}

function generateAdministrators(paths, methods, callback){
	if(generatorConfig.administrators.enabled){
		group.generate('administrators', generatorConfig.administrators.size, function(group, onAccessGenerated){
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
	if(generatorConfig.moderators.enabled){
		group.generate('moderators', generatorConfig.moderators.size, function(group, onAccessGenerated){
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
	if(generatorConfig.users.enabled){
		group.generate('users', generatorConfig.users.size, function(group, onAccessGenerated){
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

var paths = routing.getRoutesList();
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
