function checkRights(user, resource, method, callback){
    for(accessPath in user.access){
        if(accessPath.path === resource){
            callback(null, true);
            break;
        }
    }
    
    for(group in user.groups){
        for(accessPath in group.access){
            if(accessPath.path === resource){
                callback(null, true);
                break;
            }
        }
    }
    
    callback(null, false);
}

module.exports.checkRights = checkRights;