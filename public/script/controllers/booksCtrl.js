'use strict';

var module = angular.module('mylibrary');

module.controller('BooksController', function($scope, $log, Manga){
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
						if(err) console.log(err);
						else console.log('BooksController - Table refreshed');
					}
				);
			}
		}
	}

	refreshTableData(
		$scope.table.currentPage * $scope.table.itemsPerPage,
		$scope.table.itemsPerPage,
		function onResponse(err, data){
			if(err) $log.error(err);
			else $log.info('BooksController - Table refreshed');
		}
	);

	function refreshTableData(gOffset, gLimit, callback){
		$scope.table.items = [];
		Manga.query({
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
		Manga.get({id:uuid}, function onSuccess(book){
			book.dbID = getUUID(book.href);
			$scope.table.items[i] = book;
		}, function onError(err){
			$log.error(err)
		});
	};

	function getUUID(url){
		var splittedUrl = url.split('/');
		return splittedUrl[splittedUrl.length -1];
	};

	$scope.noRef = function(e, txt){
		e.preventDefault();
		alert(txt);
		e.stopPropagation();
	}
});
