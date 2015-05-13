var async = require('async');
var helper = require('../../../../helpers/helper.js');
var log = require('../../../../logger.js');
var BookSerie = require('../../../../models/bookSerie.js');
var CSV = require('../../../../helpers/CSV.js');

var titleList = [];
var authorList = [];
var genreList = [];

function initGeneration(callback){
	CSV.parse(__dirname + './books-titles.csv', function onTitleListParsed(err, titles){
		if(err) return callback(err);
		titleList = titles;
		CSV.parse(__dirname + './books-authors.csv', function onAuthorListParsed(err, authors){
			if(err) return callback(err);
			authorList = authors;
			CSV.parse(__dirname + './books-genres.csv', function onGenreListParsed(err, genres){
				if(err) return callback(err);
				genreList = genres;
				return callback();
			});
		});
	});
};

function generate(numberOfBookSerie, onBooksGenerated){
	initGeneration(function onInitialized(err){
		if(err) return callback(err);

		async.each(
			helper.getArrayOfIndex(numberOfBookSerie),
			generateBookSerie,
			function onGenerated(err){
				if(err) return onBooksGenerated(err);
				log.info('Books generated');
				onBooksGenerated();
			}
		);
	});
}

function clean(callback){
	BookSerie.find(function(err, books){
		if(err) return callback(err);
		async.each(
			books,
			removeBook,
			callback
		);
	});
};

function generateBookSerie(index, callback){
	var bookSerie = new BookSerie();
	bookSerie.title = getTitle();
	bookSerie.alternativeTitles = [];
	var numberOfAlternativeTitles = helper.getRandomInteger(2) + 1;
	for(var i=0;i < numberOfAlternativeTitles;i++){
		bookSerie.alternativeTitles.push(getTitle());
	}

	bookSerie.description = 'Lorem ipsum dolor sit am ipsum dolor sit am ipsum dolor '
	+ 'sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum '
	+ 'dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am '
	+ 'ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit '
	+ 'am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor '
	+ 'sit am';

	bookSerie.tags = [
		'tag1' + index,
		'tag2' + index,
		'tag3' + index
	];

	bookSerie.urls = [
		{website: 'wikipedia', url: 'http://wikipedia.com'}
	];

	if(helper.getRandomBoolean()){
		bookSerie.status = 'Ongoing';
	} else {
		bookSerie.status = 'Finished';
	}

	var numberOfBooks = helper.getRandomInteger(3) + 1;

	bookSerie.books = [];
	async.each(
		helper.getArrayOfIndex(numberOfBooks),
		function generateBookAndAttachToSerie(index, callback){
			generateBook(index, bookSerie, callback);
		},
		function onBooksGenerated(err){
			if(err) return callback(err);
			bookSerie.save(callback);
		}
	);
}

function generateBook(index, bookSerie, callback){
	var book = {};
	book.isbn = '978-1-56581-231-4';
	book.title = getTitle();
	book.alternativeTitles = [];
	var numberOfAlternativeTitles = helper.getRandomInteger(2) + 1;
	for(var i=0;i < numberOfAlternativeTitles;i++){
		book.alternativeTitles.push(getTitle());
	}

	book.authors = [];
	var numberOfAuthors = helper.getRandomInteger(3) + 1;
	for(var i=0;i < numberOfAuthors;i++){
		book.authors.push(getAuthor());
	}

	book.description = index + 'Lorem ipsum dolor sit am ipsum dolor sit am ipsum dolor '
	+ 'sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum '
	+ 'dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am '
	+ 'ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit '
	+ 'am ipsum dolor sit am ipsum dolor sit am ipsum dolor sit am ipsum dolor '
	+ 'sit am';;

	book.genres = [];
	var numberOfGenres = helper.getRandomInteger(2) + 1;
	for(var i=0;i < numberOfGenres;i++){
		book.genres.push(getGenre());
	}

	book.tags = [
		'iitag1' + index,
		'itag2' + index,
		'itag3' + index
	];

	book.releaseDate = new Date();

	bookSerie.books.push(book);

	return callback();
}

function removeBook(book, callback){
	BookSerie.remove(book, callback);
}

function getTitle(){
	return titleList[helper.getRandomInteger(titleList.length)][0];
}

function getAuthor(){
	return authorList[helper.getRandomInteger(authorList.length)][0];
}

function getGenre(){
	return genreList[helper.getRandomInteger(genreList.length)][0];
}

module.exports.generate = generate;
module.exports.clean = clean;
