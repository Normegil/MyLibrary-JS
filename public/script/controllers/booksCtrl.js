'use strict';

var module = angular.module('mylibrary');

module.controller('BooksController', function($scope, $log, Alerts, BookSerie){
	$scope.alerts = Alerts;
	$scope.table= {
		items: [],
		viewType: 'List',
		itemsPerPage: 10,
		currentPage: 0,
		totalNumberOfItems: 0,

		getTotalNumberOfPages: function() {
			var totalPages = Math.floor($scope.table.totalNumberOfItems / $scope.table.itemsPerPage);
			if($scope.table.totalNumberOfItems % $scope.table.itemsPerPage !=0){
				totalPages +=1;
			}
			return totalPages;
		},

		setItemsPerPage: function(numberOfItems){
			if(numberOfItems < 10){
				this.itemsPerPage = 10;
			}else{
				this.itemsPerPage = numberOfItems;
			}
		},

		setPage: function(page) {
			$log.debug('BooksController - Attempt to change currentPage to ' + page);
			var realPage = page - 1;
			if(realPage >= 0 && realPage < $scope.table.getTotalNumberOfPages()){
				$scope.table.currentPage = realPage;
				refreshTableData(
					$scope.table.currentPage * $scope.table.itemsPerPage,
					$scope.table.itemsPerPage,
					function onResponse(err, data){
						if(err) {
							$log.error(err);
							$scope.alerts.addAlert('danger', err.data);
						}
						else $log.info('BooksController - Table refreshed');
					}
				);
			}
		}
	}

	refreshTableData(
		$scope.table.currentPage * $scope.table.itemsPerPage,
		$scope.table.itemsPerPage,
		function onResponse(err, data){
			if(err) {
				$log.error(err);
				$scope.alerts.addAlert('danger', err.data);
			}
			else $log.info('BooksController - Table refreshed');
		}
	);

	function refreshTableData(gOffset, gLimit, callback){
		$scope.table.items = [];
		BookSerie.query({
			offset: gOffset,
			limit: gLimit
		}, function onSuccess(data){
			$scope.table.totalNumberOfItems = data.totalNumberOfItems;
			for(var i=0 ; i<data.items.length ; i++){
				var item = data.items[i];
				loadBook(getUUID(item.href), i);
			}
		}, function onError(err){
			return callback(err);
		});
	};

	function loadBook(uuid, i, callback){
		BookSerie.get({id:uuid}, function onSuccess(bookSerie){
			bookSerie.dbID = getUUID(bookSerie.href);

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
			refreshTableData(
				$scope.table.currentPage * $scope.table.itemsPerPage,
				$scope.table.itemsPerPage,
				function onResponse(err, data){
					if(err) console.log(err);
					else console.log('BooksController - Table refreshed');
				}
			);
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
	}
});
