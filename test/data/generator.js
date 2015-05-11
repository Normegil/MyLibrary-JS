//Generate Test Data
var log = require('../../logger.js');
var config = require('../../config.js');
var testConfig = require('../testConfig.js');
require('mongoose').connect(config.databaseURL);

var manga = require('./helpers/manga');
if(testConfig.data.generation.mangas.enabled){
	manga.generate(testConfig.data.generation.mangas.size);
}

const PATHS = testConfig.data.generation.resource.paths;
const METHODS = testConfig.data.generation.resource.methods;

var group = require('./helpers/group.js');
if(testConfig.data.generation.administrators.enabled){
	group.generate('administrators', testConfig.data.generation.administrators.size, function(group, callback){
		group.access = [];
		for(var i = 0;i<PATHS.length;i++){
			for(var j = 0;j<METHODS.length;j++){
				group.access.push({
					path:PATHS[i],
					method:METHODS[j]
				});
			}
		}
		group.access.push({
			path:'/',
			method:'GET'
		});
		callback();
	});
}
if(testConfig.data.generation.moderators.enabled){
	group.generate('moderators', testConfig.data.generation.moderators.size, function(group, callback){
		group.access = [];
		for(var i = 0;i<PATHS.length;i++){
			for(var j = 0;j<METHODS.length;j++){
				if(METHODS[j] != 'DELETE'){
					group.access.push({
						path:PATHS[i],
						method:METHODS[j]
					});
				}
			}
		}
		group.access.push({
			path:'/',
			method:'GET'
		});
		callback();
	});
}
if(testConfig.data.generation.users.enabled){
	group.generate('users', testConfig.data.generation.users.size, function(group, callback){
		group.access = [];
		for(var i = 0;i<PATHS.length;i++){
			group.access.push({
				path:PATHS[i],
				method:'GET'
			});
		}
		group.access.push({
			path:'/',
			method:'GET'
		});
		callback();
	});
}

if(){
	
}
