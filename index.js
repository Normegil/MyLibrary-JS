var logger = require('./logger');
var config = require('./config');
var init = require('./helpers/init');

var security = require('./controllers/security/securityCtrl.js');
var express = require('express');
var bodyParser = require('body-parser');

require('mongoose').connect(config.databaseURL);
var router = express.Router();
require('./routes')(router);

init(launchServer);

function launchServer(err){
	if (err) throw err;
	var app = express();
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(security.authenticateAndAuthorize);
	app.use('/rest', router);
	app.get('/', function(request, response){
		response.sendFile(__dirname + '/public/index.html');
	});
	app.listen(config.port);
}
