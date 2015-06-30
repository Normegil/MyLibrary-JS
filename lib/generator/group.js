'use strict';

var async = require('async');

var log = requireModule('logger').generator;
var Group = requireModule('models').Group;

var userHelper = require('./user.js');

function generate(name, numberOfUsers, generateAccess){
	log.info({name: name, numberOfUsers: numberOfUsers}, 'Create new group: ' + name);
	var group = new Group();
	group.name = name;
	group.access = [];

	generateAccess(group, function generateNewUsers(onGroupGenerated){
		var groups = [group];
		generateUsers(numberOfUsers, {name: name, groups: groups}, function saveAllGroups(err){
			if(err) {
				log.error({err: err, userBaseName: name, numberOfUsers: numberOfUsers, groups: groups}, 'Error while generating users');
				return onGroupGenerated(err);
			}
			async.each(
				groups,
				function saveGroup(group, asyncCallback){
					group.save(asyncCallback);
				},
				function onGenerated(err){
					if(err) {
						log.error({err: err, groups: groups}, 'Error while saving groups');
						return onGroupGenerated(err);
					}
					log.info('Group generated ('+name+')');
					onGroupGenerated(null, true);
				}
			);
		});
	});
}

function clean(callback){
	log.info('Clean all groups');
	Group.find(function(err, groups){
		if(err) { return callback(err); }
		async.each(
			groups,
			removeGroup,
			callback
		);
	});
}

function removeGroup(group, callback){
	log.debug({group: group}, 'Clean group: ' + group.name);
	Group.remove(group, callback);
}

function generateUsers(numberOfUser, userOptions, onGenerationDone){
	var baseName = userOptions.name;
	var groups = userOptions.groups;
	async.each(
		getUserNames(numberOfUser, baseName),
		function generateUser(name, asyncCallback){
			userHelper.generate(name, groups, function assignUserToGroup(err, user){
				if(err) { return asyncCallback(err); }
				for(var i = 0 ; i < groups.length ; i++){
					groups[i].users.push(user);
				}
				return asyncCallback(null, groups);
			});
		},
		onGenerationDone
	);
}

function getUserNames(numberOfUser, baseName){
	var names=[];
	for(var i=0 ; i<numberOfUser ; i++){
		names.push(baseName + ' ' + i);
	}
}

module.exports = {
	generate: generate,
	clean: clean
};
