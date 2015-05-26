'use strict';

angular
	.module('mylibrary')
	.controller('BookDetailController', function($scope, $log, BookSerie, Alerts, $stateParams, _){
		$scope.book = {};

		BookSerie.get({id:$stateParams.serieId}, function onSuccess(bookSerie){
			$scope.bookSerie = bookSerie;
			var books = _.filter(bookSerie.books, function(book){ return book._id === $stateParams.bookId })
			$scope.book = _.reduce(books, function(memo, book){
				if(book !== undefined) $log.error('Book not undefined:' + books);
				else return memo;
			})
		}, function onError(err){
			Alerts.add('warning', err.data);
		});
	});
