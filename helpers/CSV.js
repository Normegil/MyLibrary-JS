'use strict';
var fs = require('fs');
var csvParse = require('csv');

var CSV = {
	parse: function(path, callback){
		fs.readFile(path, function parseFile(error, data){
			if(error) return callback(error);
			csvParse.parse(data, { delimiter: ';'	}, callback);
		});
	}
};

module.exports = CSV;
