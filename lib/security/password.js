'use strict';
var bcrypt = require('bcryptjs');
var log = requireModule('logger').security;
var config = requireModule('config');

function getHash(password, callback) {
  var bcryptIterations = config.security.password.bcryptIterations;
  log.debug(
    {bcryptIterations: bcryptIterations},
    'Generate password salt with BCrypt');
  bcrypt.genSalt(bcryptIterations, function generateHash(err, salt) {
    if (err) {
      return callback(err);
    }
    log.debug('Generate password hash with BCrypt');
    bcrypt.hash(password, salt, function useHash(err, hash) {
      if (err) {
        return callback(err);
      }
      return callback(null, hash);
    });
  });
}

function check(password, hash, callback) {
  log.debug('Compare password with hash using BCrypt');
  bcrypt.compare(password, hash, callback);
}

module.exports.check = check;
module.exports.getHash = getHash;
