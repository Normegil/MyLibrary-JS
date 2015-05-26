var log = requireModule('logger');
var Group = requireModule('models').Group;

function checkRights(user, resource, method, callback){
	var userAccess = checkAccessRights(user.access, resource, method);
	if(userAccess){
		return callback(null, true);
	} else {
		Group.find({users: user}, function onGroupLoad(err, groups){
			if (err)	return callback(err);
			if (groups == null) {
				log.trace('No Group found for ' + user);
				return callback(null, false);
			} else {
				return callback(null, checkGroupsRights(groups, resource, method));
			}
		});
	}
}

function checkGroupsRights(groups, resource, method){
	for(var i=0 ; i<groups.length ; i++){
		var hasAccess = checkAccessRights(groups[i].access, resource, method);
		if(hasAccess){
			return true;
		}
	}
	return false;
}

function checkAccessRights(accessList, resource, method){
	for(var i=0 ; i<accessList.length ; i++){
		if(hasAccess(accessList[i], resource, method)){
				return true;
		}
	}
	return false;
}

function hasAccess(access, resource, method){
	return access.path === resource
		&& access.method === method;
}

module.exports.checkRights = checkRights;
