'use strict';
var jwt = require('jsonwebtoken');
var h = requireModule('helper');
var log = requireModule('logger').security;
var keyManager = require('../keyManager.js');
var passwordHelper = require('../password.js');
var config = requireModule('config');

function authenticate(options, callback) {
  var authorizationHeader = options.headers.authorization;
  var tokenHeader = options.headers.token;
  var user = options.user;
  if (h.exist(authorizationHeader) && '' !== authorizationHeader) {
    log.debug('Authentication by Password : ' + user.pseudo);
    h.request.getPseudoAndPasswordFromAuthorizationHeader(
      authorizationHeader,
      function onDecode(err, userInfo) {
        if (err) {
          return callback(err);
        }
        authenticatePassword(
          user,
          userInfo.password,
          callback);
      });
  } else if (h.exist(tokenHeader)) {
    log.debug('Authentication by Token : ' + tokenHeader);
    authenticateToken(user, tokenHeader, callback);
  } else if (user.pseudo === config.security.guest.pseudo) {
    log.debug('Guest user');
    return callback(null, true);
  }
  return callback(
    new Error('Authentication Headers not existing and not using guest user'));
}

function authenticatePassword(user, sentPassword, callback) {
  passwordHelper.check(sentPassword, user.hashPassword,
    function executeCallback(err, result) {
      return callback(err, result);
    }
  );
}

function authenticateToken(user, token, callback) {
  keyManager.load(
    config.security.token.key.name,
    function checkTokenValidity(err, key) {
      if (err) {
        return callback(err);
      }
      jwt.verify(token, key.public, function sendTokenValidationResult(err) {
        if (err) {
          return callback(null, false);
        }
        return callback(null, true);
      });
    });
}

module.exports.authenticate = authenticate;
