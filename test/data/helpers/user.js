var logger = require('../../../logger');
var config = require('../../../config');
var bcrypt = require('bcryptjs');
var User = require('../../../models/user');

var user = {
	generate: function (name, groups, callback){
		var user = new User();
		user.pseudo = name;
		bcrypt.genSalt(config.security.password.bcryptIterations, function(err, salt) {
			bcrypt.hash(user.pseudo, salt, function(err, hash) {
				if(err){
					callback(error);
				}else{
					user.hashedPassword = hash;
					user.save(function(error, userSaved){
						if(error){
							callback(error);
						}else{
							logger.info('Saved - User - ' + userSaved.pseudo);
							callback(null, userSaved);
						}
					});
				}
			});
		});
	},
	clean: function(){
		User.find(function(error, users){
			if(error){
				logger.error(error);
			}else{
				for(var i = 0 ; i < users.length ; i++){
					User.remove(user[i], function(error, user){
						if(error){
							logger.error(error);
						}else{
							logger.info('Removed - User');
						}
					});
				}
			}
		});
	}
}

module.exports = user;