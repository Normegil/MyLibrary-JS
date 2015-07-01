'use strict';
var async = require('async');
var _ = require('underscore');
var log = requireModule('logger').security;
var config = requireModule('config');
var errorCtrl = requireModule('rest').error;
var h = requireModule('helper');
var authorization = require('./authorization.js');
var authenticator = require('./authentication.js');

function secure(options, next) {
  var request = options.request;
  var response = options.response;
  var whiteList = options.whiteList;

  if (!mustBeSecured(request, whiteList)) {
    log.info(
      {req: request, whiteList: whiteList},
      'Request whiteListed - Not Verified: ' +
      request.method + ' - ' + h.request.getFullUrl(request));
    return next();
  }
  log.info({req: request, whiteList: whiteList}, 'Verifying request');
  var authorizationHeader = request.get(config.http.header.authentication);
  var tokenHeader = request.get(config.security.token.key.name);

  log.debug('Load user based on header');
  h.request.getUserFromHeaders(
    authorizationHeader,
    tokenHeader,
    function onLoad(err, user) {
      if (err) {
        return errorCtrl.handle(request, response, {code: 50000, error: err});
      }
      async.parallel(
        {
          authentication: function authenticationAsync(callback) {
            authenticator.authenticate(
              {
                user: user,
                headers: {
                  authorization: authorizationHeader,
                  token: tokenHeader,
                },
              }, callback);
          },
          authorization: function authorizationAsync(callback) {
            authorization.checkRights(
              {
                user: user,
                path: h.request.getRequestedResourcePath(request),
                method: request.method,
              }, callback);
          },
        },
        function onVerifiedAsync(err, results) {
          return onVerified(
            err,
            {
              request: request,
              response: response,
              user: user,
              results: results,
            },
            next);
        }
      );
    });
}

function mustBeSecured(request, whiteList) {
  var resourcePath = h.request.getRequestedResourcePath(request);
  var splittedResourcePath = resourcePath.split('/');
  var result = _.find(
    whiteList,
    function checkAgainstResource(whiteListElement) {
      if (!h.exist(whiteListElement.method) ||
        whiteListElement.method === request.method) {
        return _.isEqual(
            whiteListElement.path,
            splittedResourcePath.slice(0, whiteListElement.path.length));
      } else {
        return false;
      }
    });

  if (h.exist(result)) {
    return false;
  } else {
    return true;
  }
}

function onVerified(err, options, callback) {
  var request = options.request;
  var response = options.response;
  var user = options.user;
  var results = options.results;
  if (err) {
    errorCtrl.handle(request, response, {
      code: 50000,
      error: err,
    });
  } else if (!results.authentication) {
    log.warn(
      {authentication: results.authentication},
      'Authentication failed: ' + user.pseudo);
    errorCtrl.handle(request, response, {
      code: 40100,
      error:
        new Error('User ' + user.pseudo + ' fail to authenticate'),
    });
  } else if (!results.authorization) {
    log.warn(
      {authorization: results.authorization},
      'Authorization failed: ' + user.pseudo);
    errorCtrl.handle(request, response, {
      code: 40300,
      error: new Error('User ' + user.pseudo + ' not authorized to access ' +
      'resource ' + request.originalUrl + ' with method ' + request.method),
    });
  } else {
    // Correct Authentication + Authorization
    return callback(null, true);
  }
}

module.exports.secure = secure;
