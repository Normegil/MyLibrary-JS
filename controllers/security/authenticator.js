var User = require('../../models/user.js');
var config = require('../../config');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keyManager = require('./keyManager');

function authenticateAuthorizationHeader(userPseudo, password, callback){
    User.find({ pseudo: userPseudo }, function(error, user){
            if(error){
                callback(error);
            }else{
                bcrypt.compare(
                    password, 
                    user[0].hashedPassword, 
                    function(error, result){
                        callback(error, result, user)
                    }
                );
            }
        });
}

function authenticateToken(token, callback){
    keyManager.load(config.security.token.key.name, function(error, key){
        if(error){
            callback(error);
        }else{
            jwt.verify(token, key.public, function(error, payload){
                if(error){
                    callback(null, false);
                }else{
                    User.find({ pseudo: payload.iss }, function(error, user){
                        if(error){
                            callback(error);
                        }else{
                            callback(error, true, user[0]);
                        }
                    });
                }
            });
        }
    });
}

module.exports.authenticateAuthorizationHeader = authenticateAuthorizationHeader;
module.exports.authenticateToken = authenticateToken;