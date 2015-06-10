'use strict';

var module = angular
	.module('mylibrary')
	.controller('EditBookSerieModalController', function($scope, $log, $modalInstance, serieId, Alerts, BookSerie, _){
		$scope.title = 'Add a serie';

		$scope.booksList = {
			title: 'Books',
			displayedBooks: [],
			currentPage: 0,
			itemsPerPage: 5,
			availableSizes: [
				5,
				10,
				20
			],
			totalNumberOfItems: 0,
			refresh: function refresh(page, size){
				$log.info('Refreshing Book Table with page ' + page + ' and size ' + size);
				$scope.booksList.totalNumberOfItems = $scope.bookSerie.books.length;
				$scope.booksList.displayedBooks = getListFrom(
					$scope.bookSerie.books,
					page * size,
					size
				);
			}
		};

		if(serieId !== undefined && serieId !== null){
			BookSerie.get({id:serieId}, function onSuccess(bookSerie){
				$scope.bookSerie = bookSerie;
				$scope.title = 'Edit ' + bookSerie.title;
				$scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
			}, function onError(err){
				Alerts.add('warning', err.data);
			});
		} else {
			$scope.bookSerie = {};
			$scope.bookSerie.books = [];
			$scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
		}

		$scope.ok = function(){
			$modalInstance.close($scope.bookSerie);
		}

		$scope.reset = function(){
			$scope.bookSerie = angular.copy(originalBookSerie);
		}

		$scope.addBook = function addBook(){
			var modal = $modal.open({
				animation:true,
				controller: 'AddBookModalController',
				size: 'lg',
				templateUrl: 'modules/book/addBookModal/addBookModal.html',
				resolve:{
					serieId: function getSerieId(){
						return $scope.bookSerie.dbId;
					}
				}
			});
			modal.result.then(function onSuccess(){
				$scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
			});
		}
		$scope.editBook = function editBook(e, bookId){
			e.stopPropagation();
			var modal = $modal.open({
				animation:true,
				controller: 'AddBookModalController',
				size: 'lg',
				templateUrl: 'modules/book/addBookModal/addBookModal.html',
				resolve:{
					serieId: function getSerieId(){
						return $scope.bookSerie.dbId;
					},
					bookId: function getBookId(){
						return bookId;
					}
				}
			});
			modal.result.then(function onSuccess(){
				$scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
			});
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
	})
	.value('bookId', null);
