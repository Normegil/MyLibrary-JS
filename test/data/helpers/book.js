var async = require('async');
var log = require('../../../logger.js');
var Book = require('../../../models/book.js');
var CSV = require('../../../helpers/CSV.js');

var titleList = [];
var authorList = [];
var genreList = [];
function generate(numberOfBooks, onBooksGenerated){
	initGeneration(function onInitialized(err){
		if(err) return onBooksGenerated(err);
		var index = [];
		for(var i = 0;i< numberOfBooks ;i++){
			index.push(i);
		}

		async.each(
			index,
			generateBook,
			function onGenerated(err){
				if(err) return onBooksGenerated(err);
				log.info('Books generated');
				onBooksGenerated();
			}
		);
	});
};

function initGeneration(callback){
	CSV.parse(__dirname + './resources/books-titles.csv', function onTitleListParsed(err, titles){
		if(err) return callback(err);
		titleList = titles;
		CSV.parse(__dirname + './resources/books-authors.csv', function onAuthorListParsed(err, authors){
			if(err) return callback(err);
			authorList = authors;
			CSV.parse(__dirname + './resources/books-genres.csv', function onGenreListParsed(err, genres){
				if(err) return callback(err);
				genreList = genres;
				return callback();
			});
		});
	});
};

function clean(callback){
	Book.find(function(err, books){
		if(err) return callback(err);
		async.each(
			books,
			removeBook,
			callback
		);
	});
};

function generateBook(index, callback){
	var book = new Book();
	book.isbn = '978-1-56581-231-4';
	book.title = getTitle();

	book.alternativeTitles = [];
	var numberOfAlternativeTitles = getRandomInteger(2) + 1;
	for(var i=0;i < numberOfAlternativeTitles;i++){
		book.alternativeTitles.push(getTitle());
	}

	book.authors = [];
	var numberOfAuthors = getRandomInteger(3) + 1;
	for(var i=0;i < numberOfAuthors;i++){
		book.authors.push(getAuthor());
	}

	book.genres = [];
	var numberOfGenres = getRandomInteger(2) + 1;
	for(var i=0;i < numberOfGenres;i++){
		book.genres.push(getGenre());
	}

	book.tags = [
		'tag1' + index,
		'tag2' + index,
		'tag3' + index
	];

	book.urls = [
		{type: 'wikipedia', url: 'http://wikipedia.com'}
	];

	book.releaseDate = new Date().toISOString();

	book.save(callback);
};

function removeBook(book, callback){
	Book.remove(book, callback);
}

function getTitle(){
	return titleList[getRandomInteger(titleList.length)][0];
}

function getAuthor(){
	return authorList[getRandomInteger(authorList.length)][0];
}

function getGenre(){
	return genreList[getRandomInteger(genreList.length)][0];
}

function getRandomInteger(upperLimit){
	var index = Math.floor(Math.random() * upperLimit);
	return index;
}

module.exports.generate = generate;
module.exports.clean = clean;
module.exports.generateBook = generateBook;
module.exports.removeBook = removeBook;
