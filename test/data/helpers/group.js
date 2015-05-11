var log = require('../../../logger.js');

var Group = require('../../../models/group');
var userHelper = require('./user');

function generateUsers(numberOfUser, baseName, groups, callback){
	log.trace('GenerateUsers - NumberOfUser: ' + numberOfUser);
	log.trace('GenerateUsers - BaseName: ' + baseName);
	log.trace('GenerateUsers - Groups: ' + groups);

	if(numberOfUser == 0){
		callback(null, groups);
	}else if(numberOfUser > 0){
		userHelper.generate(baseName + numberOfUser, groups, function(error, user){
			log.trace('Assign user to group - Error: ' + error);
			log.trace('Assign user to group - User: ' + user.pseudo);
			if(error){
				callback(error);
			}else{
				for(var i = 0 ; i < groups.length ; i++){
					groups[i].users.push(user);
				}
				generateUsers(numberOfUser - 1, baseName, groups, callback);
			}
		});
	}
}

var group = {
	generate: function (name, numberOfUsers, generateAccess){
		var group = new Group();
		group.name = name;
		group.users = [];
		group.access = [];
		generateAccess(group, function(){
			var groups = [group];
			generateUsers(numberOfUsers, name, groups, function(error, groups){
				if(error){
					log.error(error);
				}else{
					for(var i = 0 ; i < groups.length ; i++){
						groups[i].save(function(error){
							if(error){
								log.error('Error - ' + group.name + ' - ' + error);
							}else{
								log.info('Saved - Group - ' + group.name);
							}
						});
					}
				}
			});
    	});
	},

	clean: function(){
		Group.find(function(error, groups){
			if(error){
				log.error(error);
			}else{
				for(var i = 0 ; i < groups.length ; i++){
					Group.remove(group[i], function(error, group){
						if(error){
							log.error(error);
						}else{
							log.info('Removed - Group');
						}
					});
				}
			}
		});
	}
}

module.exports = group;
