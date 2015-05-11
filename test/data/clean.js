var config = require('../../config');
require('mongoose').connect(config.databaseURL);

var manga = require('./helpers/manga');
manga.clean();

var user = require('./helpers/user');
user.clean();

var group = require('./helpers/group');
group.clean();