var crypto = require('crypto');
var config = require('../../config');
var Key = require('../../models/key');

var keyManager = {
    load: function(name, callback){
        console.log('Getting key :"' + name + '"');
        Key.findById(name, function(error, key){
            if(error){
                callback(error);
            }else if(!key){
                var key = new Key();
                key.name = name;
                
                var diffieHellman = crypto.createDiffieHellman(config.security.key.size);
                diffieHellman.generateKeys();
                
                key.public = diffieHellman.getPublicKey('base64');
                key.private = diffieHellman.getPrivateKey('base64');
                
                key.save(function(error){
                    if(error){
                        throw error;
                    }else{
                        callback(null, key);
                    }
                });
            }else{
                callback(null, key);
            }
        });
    }
}

module.exports = keyManager;