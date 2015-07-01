'use strict';

var async = require('async');
var bcrypt = require('bcryptjs');

var log = requireModule('logger').generator;
var config = requireModule('config');
var User = requireModule('models').User;

function generate(name, groups, callback) {
  log.info({name: name, groups: groups}, 'Generate user: ' + name);
  var user = new User();
  user.pseudo = name;
  var bcryptIterations = config.security.password.bcryptIterations;
  log.debug('Generate user\'s salt using Bcrypt : ' + bcryptIterations);
  bcrypt.genSalt(bcryptIterations, function onSaltGenerated(err, salt) {
    if (err) {
      return callback(err);
    }
    log.debug('Generate user\'s password hash using Bcrypt');
    bcrypt.hash(user.pseudo, salt, function onHashGenerated(err, hash) {
      if (err) {
        return callback(err);
      }
      user.hashedPassword = hash;
      log.debug('Save user: ' + user.pseudo);
      user.save(callback);
    });
  });
}

function clean(callback) {
  log.info('Clean all users');
  User.find(function onFound(err, users) {
    if (err) {
      return callback(err);
    }
    async.each(
      users,
      removeUser,
      callback
    );
  });
}

function removeUser(user, callback) {
  log.debug('Remove user: ' + user.pseudo);
  User.remove(user, callback);
}

module.exports = {
  generate: generate,
  clean: clean,
};
