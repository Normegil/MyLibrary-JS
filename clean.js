'use strict';

global.requireModule = function(name){
	return require(__dirname + '/lib/' + name);
};

var async = require('async');
var mongoose = require('mongoose');

var config = requireModule('config');
var log = requireModule('logger');
var generator = requireModule('generator');

mongoose.connect(config.databaseURL);

var book = generator.books;
var user = generator.user;
var group = generator.group;
async.parallel({
		book: function(callback){
			book.clean(callback);
		},
		user: function(callback){
			user.clean(callback);
		},
		group: function(callback){
			group.clean(callback);
		}
	}, function onFinished(err){
		if(err) {
			log.error({error:err}, 'Error during cleaning');
		}else{
			log.info('Cleaning finished');
			process.exit();
		}
	}
);
