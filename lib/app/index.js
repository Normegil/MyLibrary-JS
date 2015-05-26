'use strict';

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var u = require('underscore');

var logger = requireModule('logger');
var csv = requireModule('csv');
var config = requireModule('config');
var routing = requireModule('routing');
var security = requireModule('security');

var init = require('./init.js');

function launch(port){
	logger.info('Connect Mongoose to ' + config.databaseURL);
	mongoose.connect(config.databaseURL);
	var BASE_REST_PATH = '/rest';
	init(BASE_REST_PATH, function launchServer(err){
		if (err) throw err;

		logger.info('Setup routing');
		var router = express.Router();
		routing.setup(router);

		var app = express();
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		logger.info('Set static paths for REST services and public ressources')
		app.use(BASE_REST_PATH, router);
		var publicFolderPath = 'public';

		logger.info('Register security');
		var whiteList = [];
		app.use(function secure(request, response, next){
			logger.info('Secure');
			security.secure(request, response, whiteList,	next);
		});

		logger.info('Public folder: ' + publicFolderPath)
		app.use('/', express.static(publicFolderPath));

		csv.parse(__dirname + '/SecurityIgnoredPath.csv', function launchServer(err, securityIgnoredPaths){
			if(err) throw err;
			whiteList = u.map(securityIgnoredPaths, function toObject(securityIgnoredPath){
				var whiteListElement = {};
				if(securityIgnoredPath[0] !== ''){
					whiteListElement.method = securityIgnoredPath[0];
				}
				whiteListElement.path = securityIgnoredPath[1].split('/');
				return whiteListElement;
			});
			logger.info({SecurityIgnoredPath: whiteList}, 'SecurityIgnoredPath');
			logger.info('Server listening on port : ' + port);
			app.listen(port);
		})
	});
}

module.exports.launch = launch;
