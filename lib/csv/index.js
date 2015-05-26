'use strict';
var fs = require('fs');
var csvParse = require('csv');

var logger = requireModule('logger');

var CSV = {
	parse: function(path, callback){
		logger.debug('Path to file:' + path);
		fs.readFile(path, function parseFile(error, data){
			if(error) return callback(error);
			csvParse.parse(data, { delimiter: ';'	}, callback);
		});
	}
};

module.exports = CSV;
