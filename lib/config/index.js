var generation = require('./generation.js');

var config = {
	databaseURL: process.env.MONGODB_URI || 'mongodb://localhost/mylibrary',
	port: process.env.PORT || 8080,

	http:{
		header:{
			authentication: 'Authorization',
			token: 'AccessToken'
		}
	},

	security:{
		password:{
			bcryptIterations: 10
		},
		token:{
			algorithm: 'ES512',
			key:{
				name: 'JsonWebToken Signing Key',
				size: 128,
			},
		},
		guest: {
			pseudo: 'guest'
		}
	},

	rest:{
		collections: {
			defaultLimit: process.env.REST_COLLECTIONS_DEFAULT_SIZE || 25,
			maxLimit: process.env.REST_COLLECTIONS_DEFAULT_SIZE || 500
		}
	}
}

module.exports = config;
module.exports.generation = generation;
