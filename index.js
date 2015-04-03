var config = require('./config');
require('mongoose').connect(config.databaseURL);
var security = require('./controllers/security');

var express = require('express');
var router = express.Router();
require('./routes')(router);

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(security.authenticate);
app.use('/rest', router);

app.listen(config.port);
console.log('Server listening on port ' + config.port);
console.log('Database URI: ' + config.databaseURL);