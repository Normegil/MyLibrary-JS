'use strict';
global.requireModule = function requireModule(name) {
  return require(__dirname + '/lib/' + name);
};

var async = require('async');
var mongoose = require('mongoose');
var config = requireModule('config');
var log = requireModule('logger');
var generator = requireModule('generator');
var book = generator.books;
var user = generator.user;
var group = generator.group;

mongoose.connect(config.databaseURL);

async.parallel({
    book: function cleanAllBooks(callback) {
      book.clean(callback);
    },
    user: function cleanAllUsers(callback) {
      user.clean(callback);
    },
    group: function cleanAllGroups(callback) {
      group.clean(callback);
    },
  }, function onFinished(err) {
    if (err) {
      log.error({error: err}, 'Error during cleaning');
    } else {
      log.info('Cleaning finished');
      process.exit();
    }
  }
);
