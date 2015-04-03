var fs = require('fs');
var csvParse = require('csv');

var csvParser = {
	parse: function(path, callback){
		fs.readFile(path, function(error, data){
			if(error){
				callback(error);
			}else{
                console.log('Parse Error file');
				csvParse.parse(
					data,
					{
						delimiter: ';'
					},
					callback
				);
			}
		});
	}
}

module.exports = csvParser;
