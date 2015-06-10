'use strict';

var module = angular
	.module('mylibrary')
	.controller('AddBookModalController', function($scope, $log, $modalInstance, serieId, bookId, Alerts, BookSerie){
		var originalBook = {};
		$scope.book = {};
		$scope.bookSerie;
		$scope.title = 'Add a book';
		if(serieId !== undefined && serieId !== null){
			$scope.bookSerie = BookSerie.get({id:serieId}, function onLoad(bookSerie){
				$scope.bookSerie = bookSerie;
				if(bookId !== undefined && bookId !== null){
					var book = _.find($scope.bookSerie.books, function find(book){ return bookId === book._id; });
					$scope.book = angular.copy(book);
					originalBook = angular.copy(book);
					$scope.title = bookSerie.title + ' - Edit ' + $scope.book.title;
				}else{
					$scope.title = bookSerie.title + ' - Add a Book';
				}
			}, function onError(err){
				Alerts.add('warning', err.data);
			});
		}

		$scope.ok = function(){
			if(bookId !== undefined && bookId !== null){
				var book = _.find($scope.bookSerie.books, function find(book){ return bookId === book._id; });
				angular.copy($scope.book, book);
			}else{
				$scope.bookSerie.books.push($scope.book);
			}
			$modalInstance.close($scope.bookSerie);
		}

		$scope.reset = function(){
			$scope.book = angular.copy(originalBook);
		}
	})
	.value('bookId', null);
