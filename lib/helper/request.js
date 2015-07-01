'use strict';
var validator = require('validator');
var jwt = require('jsonwebtoken');
var config = requireModule('config');
var secLog = requireModule('logger').security;
var User = requireModule('models').User;
var h = require('./generic.js');

function getFullUrl(request) {
  return getFullUrlWithOriginalUrl(request, request.originalUrl);
}

function getFullUrlWithOriginalUrl(request, originalUrl) {
  return request.protocol + '://' + request.get('Host') + originalUrl;
}

function getFullUrlSkippingParameters(request) {
  return getFullUrlWithOriginalUrl(request, getRequestedResourcePath(request));
}

function getRequestedResourcePath(request) {
  var splittedUrl = request.originalUrl.split('?');
  var possibleUUID = splittedUrl[0].split('/').pop();
  return validator.isUUID(possibleUUID) ?
    splittedUrl[0].substr(0, splittedUrl[0].lastIndexOf('/'))
    : splittedUrl[0];
}

function getOffset(request) {
  var limit = request.query.offset || 0;
  return h.getAsInteger(limit);
}

function getLimit(request) {
  var limit = request.query.limit || config.rest.collections.defaultLimit;
  limit = h.getAsInteger(limit);
  if (limit > config.rest.collections.maxLimit) {
    limit = config.rest.collections.maxLimit;
  }
  return limit;
}

function getLinksOnly(request) {
  var linksOnly = request.query.linksOnly || false;
  return h.getAsBoolean(linksOnly);
}

// jscs:disable maximumLineLength
function getPseudoAndPasswordFromAuthorizationHeader(authorizationHeader, callback) {
  // jscs:enable maximumLineLength
  var splittedHeader = authorizationHeader.split(' ');
  if ('Basic' === splittedHeader[0]) {
    var userAndPass = new Buffer(splittedHeader[1], 'base64')
      .toString('utf8')
      .split(';');
    return callback(null, {
      pseudo: userAndPass[0],
      password: userAndPass[1],
    });
  }
  return callback(
    new Error('Doesn\'t support other authentication method than Basic'));
}

function getPseudoFromToken(tokenHeader, callback) {
  var payload = jwt.decode(tokenHeader);
  return callback(null, {
    pseudo: payload.iss,
  });
}

function getUserFromHeaders(authorizationHeader, tokenHeader, callback) {
  if (authorizationHeader && '' !== authorizationHeader) {
    h.request.getPseudoAndPasswordFromAuthorizationHeader(
      authorizationHeader,
      function onDecode(err, userInfo) {
        if (err) {
          return callback(err);
        }
        secLog.debug({pseuod: userInfo.pseudo}, 'Authentication by Password');
        loadUser(userInfo.pseudo, callback);
      });
  } else if (null !== tokenHeader && tokenHeader) {
    secLog.debug('Authentication by Token : ' + tokenHeader);
    h.request.getPseudoFromToken(tokenHeader, function onDecode(err, userInfo) {
      if (err) {
        return callback(err);
      }
      loadUser(userInfo.pseudo, callback);
    });
  } else {
    var guestPseudo = config.security.guest.pseudo;
    secLog.trace({guestPseudo: guestPseudo}, 'Using guest user');
    loadUser(guestPseudo, callback);
  }
}

function loadUser(givenPseudo, callback) {
  User.findOne({pseudo: givenPseudo}, function onLoad(err, user) {
    if (err) {
      return callback(err);
    } else if (!h.exist(user)) {
      return callback(new Error('User ' + givenPseudo + ' not found'));
    } else {
      return callback(null, user);
    }
  });
}

module.exports = {
  getFullUrl: getFullUrl,
  getFullUrlSkippingParameters: getFullUrlSkippingParameters,
  getRequestedResourcePath: getRequestedResourcePath,
  getOffset: getOffset,
  getLimit: getLimit,
  getLinksOnly: getLinksOnly,
  getPseudoFromToken: getPseudoFromToken,
  getUserFromHeaders: getUserFromHeaders,
  getPseudoAndPasswordFromAuthorizationHeader:
    getPseudoAndPasswordFromAuthorizationHeader,
};
