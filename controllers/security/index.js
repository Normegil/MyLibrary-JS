var jwt = require('jsonwebtoken');
require('./authenticator');
var rights = require('./accessRights');
var errorCtrl = require('../errorCtrl');
var config = require('../../config');
var keyManager = require('./keyManager');
var User = require('../../models/user')

var securityController = {
    authenticate: function(request, response){
        
        var authorizationHeader = request.get(config.http.header.authentication);
        var tokenHeader = request.get(config.security.token.key.name);
        
        authenticate(
            authorizationHeader,
            tokenHeader,
            function(error, result, user){
                if(error){
                    errorCtrl.handle(response, 50000, error);
                }else if(!result){
                    errorCtrl.handle(response, 40100, 'Wrong credentials');
                }else{
                    rights.checkRights(user, request.originalUrl, request.method, function(error, hasRight){
                        if(error){
                            errorCtrl.handle(response, 50000, error);
                        }else if(!hasRight){
                            errorCtrl.handle(response, 40300, "User authenticated don't have the right to access '" + request.protocol + '://' + request.get('Host') + request.originalUrl + "'");
                        }else{
                            if(user.pseudo !== 'guest'){
                                keyManager.load(config.security.token.key.name, function(error, key){
                                    if(error){
                                        throw error;
                                    }else{
                                        var newToken = jwt.sign(
                                        {
                                            iss: user.pseudo,
                                        }, 
                                        privateKey, 
                                        {
                                            algorithm: config.security.token.algorithm,
                                            expiresInMinutes: 4320 //3 Days
                                        });
                                        response.set(config.http.header.token, newToken);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        );
    }
}

function authenticate(authorizationHeader, tokenHeader, callback){
    if(authorizationHeader && authorizationHeader !== ''){
        console.log('Authentication by Header : ' + authorizationHeader)
        authenticateByAuthorizationHeader(authorizationHeader, callback);
    }else if(tokenHeader !== null && tokenHeader){
        console.log('Authentication by Token : ' + authorizationHeader)
        authenticateToken(tokenHeader, callback);
    }else{
        var guest = new User();
        guest.pseudo = 'guest';
        callback(null, true, guest);
    }
}

function authenticateByAuthorizationHeader(authorizationHeader, callback){
    var splittedHeader = authorizationHeader.split(' ');
    if(splittedHeader[0] === 'Basic'){
        var userAndPass = new Buffer(splittedHeader[1], 'base64')
            .toString('utf8')
            .split(';');
        authenticateAuthorizationHeader(
            userAndPass[0],
            userAndPass[1],
            callback
        );
    }
}

module.exports = securityController;