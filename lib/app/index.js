'user strict';
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var u = require('underscore');

var csv = requireModule('csv');
var config = requireModule('config');
var routing = requireModule('routing');
var security = requireModule('security');
var logModule = requireModule('logger');
var initLog = logModule.init;
var secLog = logModule.security;

var init = require('./init.js');

function launch(port){
	'use strict';

	initLog.info('Connect Mongoose to ' + config.databaseURL);
	mongoose.connect(config.databaseURL);
	var BASE_REST_PATH = '/rest';
	init(BASE_REST_PATH, function launchServer(err){
		if (err) {
			initLog.fatal({error: err}, 'Error during initializing process');
			throw err;
		}
		initLog.info('Launching Server');

		initLog.debug('Setup routing');
		var router = express.Router();
		routing.setup(router);

		var app = express();
		initLog.debug('Add request parsers to express');
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		initLog.debug('Set static paths for REST services and public ressources');
		app.use(BASE_REST_PATH, router);
		var publicFolderPath = 'public';

		initLog.debug ('Add public folder: ' + publicFolderPath);
		app.use('/', express.static(publicFolderPath));

		loadIgnoredPaths(function onLoad(err, whiteList){
			if(err){
				initLog.fatal({error: err}, 'Error while parsing file defining URL paths ignored by security');
				throw err;
			}
			initLog.warn('Security not registered');
			/*
			initLog.debug('Register security');
			app.use(function secure(request, response, next){
				logger.info('Secure');
				security.secure(request, response, whiteList,	next);
			});*/
			app.listen(port);
			initLog.info('Server listening on port : ' + port);
		});
	});
}

function loadIgnoredPaths(callback){
	'use strict';
	initLog.debug('Parsing file defining URL paths ignored by security');
	csv.parse(__dirname + '/SecurityIgnoredPath.csv', function launchServer(err, securityIgnoredPaths){
		if(err) {
			return callback(err);
		}
		var whiteList = u.map(securityIgnoredPaths, parseIgnoredPathLine);
		secLog.debug({SecurityIgnoredPath: whiteList}, 'finish loading URL paths ignored by security');
		return callback(null, whiteList);
	});
}

function parseIgnoredPathLine(ignoredPathLine){
	'use strict';
	var whiteListElement = {};
	if(ignoredPathLine[0] !== ''){
		whiteListElement.method = ignoredPathLine[0];
	}
	whiteListElement.path = ignoredPathLine[1].split('/');
	return whiteListElement;
}

module.exports.launch = launch;
