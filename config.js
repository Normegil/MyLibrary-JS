var config = {
	databaseURL: process.env.MONGODB_URI || 'mongodb://localhost/mylibrary',
	port: process.env.port || 8080,
    
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
        }
    }
}

module.exports = config;
