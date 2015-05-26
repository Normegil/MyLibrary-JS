var async = require('async');

var log = requireModule('logger');
var Group = requireModule('models').Group;

var userHelper = require('./user.js');

function generate(name, numberOfUsers, generateAccess){
	var group = new Group();
	group.name = name;

	group.access = [];
	generateAccess(group, function generateNewUsers(onGroupGenerated){
		var groups = [group];
		generateUsers(numberOfUsers, name, groups, function saveAllGroups(error){
			if(error) return callback(err);
			async.each(
				groups,
				function saveGroup(group, asyncCallback){
					group.save(asyncCallback);
				},
				function onGenerated(err){
					if(err) return onGroupGenerated(err);
					log.info('Group generated ('+name+')')
					onGroupGenerated(null, true)
				}
			)
		});
	});
};

function clean(callback){
	Group.find(function(err, groups){
		if(err) return callback(err);
		async.each(
			groups,
			removeGroup,
			callback
		);
	});
};

function removeGroup(group, callback){
	Group.remove(group, callback);
}

function generateUsers(numberOfUser, baseName, groups, onGenerationDone){
	var names=[];
	for(var i=0 ; i<numberOfUser ; i++){
		names.push(baseName + ' ' + i);
	}

	async.each(
		names,
		function generateUser(name, asyncCallback){
			userHelper.generate(name, groups, function assignUserToGroup(err, user){
				if(err) return asyncCallback(err);
				for(var i = 0 ; i < groups.length ; i++){
					groups[i].users.push(user);
				}
				return asyncCallback(null, groups);
			});
		},
		onGenerationDone
	);
};

module.exports = {
	generate: generate,
	clean: clean
};
