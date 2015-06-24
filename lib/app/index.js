'use strict';

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var u = require('underscore');

var csv = requireModule('csv');
var config = requireModule('config');
var routing = requireModule('routing');
var security = requireModule('security');
var logModule = requireModule('logger');
var initLog = logModule.init;
var errLog = logModule.error;
var secLog = logModule.security;

var init = require('./init.js');

function launch(port){
	initLog.info('Connect Mongoose to ' + config.databaseURL);
	mongoose.connect(config.databaseURL);
	var BASE_REST_PATH = '/rest';
	init(BASE_REST_PATH, function launchServer(err){
		if (err) {
			errLog.fatal({error: err}, 'Error during initializing process');
			throw err;
		}
		initLog.info('Launching Server');

		initLog.debug('Setup routing');
		var router = express.Router();
		routing.setup(router);

		var app = express();
		initLog.debug('Add request parsers to express')
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		initLog.debug('Set static paths for REST services and public ressources')
		app.use(BASE_REST_PATH, router);
		var publicFolderPath = 'public';

		var whiteList = [];
		initLog.debug('Register security');
		/*
		app.use(function secure(request, response, next){
			logger.info('Secure');
			security.secure(request, response, whiteList,	next);
		});*/

		initLog.debug('Add public folder: ' + publicFolderPath)
		app.use('/', express.static(publicFolderPath));

		initLog.debug('Parsing file defining URL paths ignored by security');
		csv.parse(__dirname + '/SecurityIgnoredPath.csv', function launchServer(err, securityIgnoredPaths){
			if(err) {
				errLog.fatal({error: err}, 'Error while parsing file defining URL paths ignored by security');
				throw err;
			}
			whiteList = u.map(securityIgnoredPaths, function toObject(securityIgnoredPath){
				var whiteListElement = {};
				if(securityIgnoredPath[0] !== ''){
					whiteListElement.method = securityIgnoredPath[0];
				}
				whiteListElement.path = securityIgnoredPath[1].split('/');
				return whiteListElement;
			});
			secLog.debug({SecurityIgnoredPath: whiteList}, 'finish loading URL paths ignored by security');
			app.listen(port);
			initLog.info('Server listening on port : ' + port);
		})
	});
}

module.exports.launch = launch;
