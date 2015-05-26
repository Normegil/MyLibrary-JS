var async = require('async');
var bcrypt = require('bcryptjs');

var logger = requireModule('logger');
var config = requireModule('config');
var User = requireModule('models').User;

function generate(name, groups, callback){
	var user = new User();
	user.pseudo = name;
	bcrypt.genSalt(config.security.password.bcryptIterations, function(err, salt) {
		bcrypt.hash(user.pseudo, salt, function(err, hash) {
			if(err) return callback(err);
			user.hashedPassword = hash;
			user.save(callback);
		});
	});
};

function clean(callback){
	User.find(function(error, users){
		if(error) return callback(err);
		async.each(
			users,
			removeUser,
			callback
		);
	});
};

function removeUser(user, callback){
	User.remove(user, callback);
};

module.exports = {
	generate : generate,
	clean: clean,
};
