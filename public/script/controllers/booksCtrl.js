'use strict';

var module = angular.module('mylibrary');

module.controller('BooksController', function($scope, $log, Alerts, BookSerie){
	$scope.alerts = Alerts;
	$scope.table = {
		title: 'Books',
		items: [],
		viewType: 'List',
		currentPage: 0,
		defaultSize: 10,
		availableSizes:[
			10,
			20,
			50,
			100,
			500
		],
		totalNumberOfItems: 0,

		refresh: function refresh(gPage, gLimit){
			var gOffset = gPage * gLimit;
			var pLinksOnly = gLimit > 50 ?
				true
				: false;
			$scope.table.items = [];
			BookSerie.query({
				offset: gOffset,
				limit: gLimit,
				linksOnly: pLinksOnly
			}, function onSuccess(data){
				$scope.table.totalNumberOfItems = data.totalNumberOfItems;
				for(var i=0 ; i<data.items.length ; i++){
					var item = data.items[i];
					if(pLinksOnly){
						loadBook(getUUID(item.href), i)
					}else{
						item.dbID = getUUID(item.href);
						item.authors = getAuthors(item);
						item.genres = getGenres(item);
						$scope.table.items.push(item);
					}
				}
				$log.info('BooksController - Table refreshed')
			}, function onError(err){
				$log.error(err);
				$scope.alerts.add('danger', err.data);
			});
		}
	};
	$scope.table.refresh($scope.table.currentPage, $scope.table.itemsPerPage);

	function loadBook(uuid, i){
		BookSerie.get({id:uuid}, function onSuccess(bookSerie){
			bookSerie.dbID = uuid;
			bookSerie.authors = getAuthors(bookSerie);
			bookSerie.genres = getGenres(bookSerie);
			$scope.table.items[i] = bookSerie;
		}, function onError(err){
			$scope.alerts.add('danger', err.data);
			$log.error(err)
		});
	};

	$scope.removeBook = function removeBook(e, gID){
		e.stopPropagation();
		BookSerie.delete({id:gID}, function onSuccess(book){
			$scope.table.refresh($scope.table.currentPage, $scope.table.itemsPerPage);
		}, function onError(err){
			$log.error(err);
			$scope.alerts.add('danger', err.data);
		});
	};

	function getUUID(url){
		var splittedUrl = url.split('/');
		return splittedUrl[splittedUrl.length -1];
	};

	function getAuthors(bookSerie){
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

	function getGenres(bookSerie){
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
	};
});
