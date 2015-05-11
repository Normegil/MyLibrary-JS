var async = require('async');
var logger = require('../../../logger');
var Book = require('../../../models/book.js');

function generate(numberOfBooks, callback){
	var names = [];
	for(var i = 0;i< numberOfBooks ;i++){
		names.push('Book ' + i);
	}

	async.each(
		names,
		generateBook,
		callback
	);
};

function clean(callback){
	Book.find(function(error, books){
		if(error){
			logger.error(error);
		}else{
			async.each(
				books,
				removeBook,
				callback
			);
		}
	});
};

function generateBook(name, callback){
	var book = new Book();
	book.name = name;
	book.save(function(err, book){
		if(err) return callback(err);
		else{
			logger.info('Saved - Book - ' + book.name);
			return callback(null, book);
		}
	});
};

function removeBook(book, callback){
	Book.remove(book, function(err){
		if(err) return callback(err);
		return callback();
	});
}


module.exports.generate = generate;
module.exports.clean = clean;
module.exports.generateBook = generateBook;
module.exports.removeBook = removeBook;
