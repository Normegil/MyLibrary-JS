'use strict';
var fs = require('fs');
var csvParse = require('csv');

var log = requireModule('logger');

var CSV = {
	parse: function(path, callback){
		log.debug({path: path}, 'Path to file to parse as CSV: ' + path);
		fs.readFile(path, function parseFile(error, data){
			if(error) { return callback(error); }
			log.debug({path: path, data: data}, 'Parse file: ' + path);
			csvParse.parse(data, { delimiter: ';'	}, callback);
		});
	}
};

module.exports = CSV;
