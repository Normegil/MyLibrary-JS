'use strict';
global.requireModule = function requireModule(name) {
  return require(__dirname + '/lib/' + name);
};

var async = require('async');
var mongoose = require('mongoose');

var config = requireModule('config');
var generator = requireModule('generator');
var log = requireModule('logger');

log.info('Connect to MongoDB: ' + config.databaseURL);
mongoose.connect(config.databaseURL);
var generatorConfig = config.generation;

var group = generator.group;
var bookSerie = generator.books;

async.parallel({
    groups: function generateAllGroupsAsync(rootAsyncCallback) {
      async.each(
        generatorConfig.groups,
        function generateGroupAsync(group, groupAsyncCallback) {
          generateGroup(group, group.hasAccess, groupAsyncCallback);
        },
        rootAsyncCallback
      );
    },
    book: function generateBooksAsync(rootAsyncCallback) {
      generateBooks(rootAsyncCallback);
    },
  }, function onFinished(err) {
    if (err) {
      log.fatal({error: err}, 'Error during generation');
      throw err;
    } else {
      log.info('Generation finished');
      process.exit();
    }
  }
);

function generateBooks(callback) {
  if (generatorConfig.books.enabled) {
    log.info('Generating books');
    bookSerie.generate(generatorConfig.books.size, callback);
  } else {
    log.info('Skipping book generation');
    callback(null, false);
  }
}

function generateGroup(groupOptions, hasAccess, callback) {
  if (generatorConfig.moderators.enabled) {
    log.info('Generating ' + groupOptions.name + ' group');
    group.generate(groupOptions.name, groupOptions.size, hasAccess);
    return callback(null, true);
  } else {
    log.info('Skipping ' + groupOptions.name + ' group generation');
    return callback(null, false);
  }
}
