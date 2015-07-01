'use strict';
var h = requireModule('helper');
var log = requireModule('logger').security;
var Group = requireModule('models').Group;

function checkRights(options, callback) {
  var user = options.user;
  var resource = options.resource;
  var method = options.method;
  log.trace(
    {method: method, resource: resource, userRights: user.access},
    'Check user access to ' + user.pseudo);
  var userAccess = checkAccessRights(user.access, resource, method);
  if (userAccess) {
    log.trace(
      {method: method, resource: resource, userPseudo: user.pseudo},
      'Access granted: ' + user.pseudo);
    return callback(null, true);
  } else {
    Group.find({users: user}, function onGroupLoad(err, groups) {
      if (err) {
        return callback(err);
      } else if (!h.exist(groups)) {
        log.trace('No Group found for ' + user);
        return callback(null, false);
      } else {
        log.trace(
          {method: method, resource: resource, groups: groups},
          'Check groups access of user: ' + user.pseudo);
        return callback(null, checkGroupsRights(groups, resource, method));
      }
    });
  }
}

function checkGroupsRights(groups, resource, method) {
  for (var i = 0;i < groups.length;i++) {
    var hasAccess = checkAccessRights(groups[i].access, resource, method);
    if (hasAccess) {
      return true;
    }
  }
  return false;
}

function checkAccessRights(accessList, resource, method) {
  for (var i = 0;i < accessList.length;i++) {
    if (hasAccess(accessList[i], resource, method)) {
      return true;
    }
  }
  return false;
}

function hasAccess(access, resource, method) {
  return access.path === resource && access.method === method;
}

module.exports.checkRights = checkRights;
