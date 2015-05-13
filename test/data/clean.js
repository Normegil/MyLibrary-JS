var async = require('async');
var config = require('../../config.js');
var log = require('../../logger.js');
require('mongoose').connect(config.databaseURL);
var book = require('./helpers/books/bookSerie.js');
var user = require('./helpers/user.js');
var group = require('./helpers/group.js');

async.parallel(
	{
		book: function(callback){
			book.clean(callback);
		},
		user: function(callback){
			user.clean(callback);
		},
		group: function(callback){
			group.clean(callback);
		}
	},
	function onFinished(err, results){
		if(err) log.error(err);
		else {
			log.info('Cleaning finished');
			process.exit();
		}
	}
);
