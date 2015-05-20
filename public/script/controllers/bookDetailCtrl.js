'use strict';

var module = angular.module('mylibrary');

module.controller('BookDetailController', function($scope, $log, BookSerie, Alerts, $stateParams, _){
	$scope.bookSerie = {};
	$scope.booksList = {
		title: 'Books',
		displayedBooks: [],
		currentPage: 0,
		itemsPerPage: 7,
		availableSizes: [
			7,
			10,
			20,
			50,
			100,
			500
		],
		totalNumberOfItems: 0,

		refresh: function refresh(page, size){
			$log.info('Refreshing Book Table with page ' + page + ' and size ' + size);
			BookSerie.get({id:$stateParams.id}, function onSuccess(bookSerie){
				$scope.bookSerie = bookSerie;
				$scope.bookSerie.dbId = getUUID(bookSerie.href);
				$scope.booksList.displayedBooks = [];
				$scope.booksList.displayedBooks = getListFrom(
					bookSerie.books,
					page * size,
					size
				);
				$scope.booksList.totalNumberOfItems = $scope.bookSerie.books !== undefined ?
					$scope.bookSerie.books.length : 0;
			}, function onError(err){
				Alerts.add('warning', err.data);
			});
		}
	};

	$scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);

	$scope.getAuthors = function getAuthors(bookSerie){
		if(bookSerie !== undefined && bookSerie.books !== undefined){
			var authors = [];
			for(var i=0 ; i<bookSerie.books.length ; i++){
				var book = bookSerie.books[i];
				for(var j=0; j<book.authors.length ; j++){
					var exist = false;
					for(var x=0; x<authors.length ;x++){
						if(authors[x] === book.authors[j]){
							exist = true;
							break;
						}
					}
					if(!exist){
						authors.push(book.authors[j]);
					}
				}
			}
			return authors;
		}
	}

	$scope.getGenres = function getGenres(bookSerie){
		if(bookSerie !== undefined && bookSerie.books !== undefined){
			var genres = [];
			for(var i=0 ; i<bookSerie.books.length ; i++){
				var book = bookSerie.books[i];
				for(var j=0; j<book.genres.length ; j++){
					var exist = false;
					for(var x=0; x<genres.length ;x++){
						if(genres[x] === book.genres[j]){
							exist = true;
							break;
						}
					}
					if(!exist){
						genres.push(book.genres[j]);
					}
				}
			}
			return genres;
		}
	};

	$scope.getEarliestReleaseDate = function getEarliestReleaseDate(bookSerie){
		if(bookSerie !== undefined && bookSerie.books !== undefined){
			var date = undefined;
			for(var i=0;i<bookSerie.books.length;i++){
				date = getEarliestDate(date, bookSerie.books[i].releaseDate);
			}
			return date;
		}
	};

	$scope.getLastReleaseDate = function getLastReleaseDate(bookSerie){
		if(bookSerie !== undefined && bookSerie.books !== undefined){
			var date = undefined;
			for(var i=0;i<bookSerie.books.length;i++){
				date = getLastDate(date, bookSerie.books[i].releaseDate);
			}
			return date;
		}
	};

	function getEarliestDate(date1, date2){
		if(date1 === undefined && date2 === undefined){
			return undefined;
		}else if(date1 === undefined && date2 !== undefined){
			return date2;
		}else if(date1 !== undefined && date2 === undefined){
			return date1;
		}else{
			if(new Date(date1).getTime() <= new Date(date2).getTime()){
				return date1;
			}else if(new Date(date1).getTime() > new Date(date2).getTime()){
				return date2;
			}
		}
	}
	function getLastDate(date1, date2){
		if(date1 === undefined && date2 === undefined){
			return undefined;
		}else if(date1 === undefined && date2 !== undefined){
			return date2 ;
		}else if(date1 !== undefined && date2 === undefined){
			return date1;
		}else{
			if(new Date(date1).getTime() >= new Date(date2).getTime()){
				return date1;
			}else if(new Date(date1).getTime() < new Date(date2).getTime()){
				return date2;
			}
		}
	}

	function getListFrom(books, offset, limit){
		if(offset < 0 || offset >= books.length){
			$log.error('Offset incorrect: ' + offset);
		}else if(limit <= 0){
			$log.error('Offset incorrect: ' + offset);
		}else{
			var sortedBooks = _.sortBy(books, function(book){return new Date(book.releaseDate).getTime()});
			var booksToReturn = [];
			for (var i = offset; i < sortedBooks.length && i - offset < limit; i++) {
				booksToReturn.push(sortedBooks[i]);
			}
			return booksToReturn;
		}
	}
	function getUUID(url){
		var splittedUrl = url.split('/');
		return splittedUrl[splittedUrl.length -1];
	};
});
