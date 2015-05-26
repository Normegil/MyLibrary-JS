'use strict';

var module = angular.module('mylibrary');

module.directive('mlPagination', function($log){
	return {
		restrict: 'AEC',
		replace: 'true',
		templateUrl: 'directives/mlPagination/mlPagination.html',
		scope: {
			currentPage: '=',
			itemsPerPage: '=',
			collectionSize: '=',
			changePage: '&'
		},
		controller: function($scope){
			$scope.numberOfPages = getTotalNumberOfPages();
			$scope.pageInput= {
				value: '',
				reset: function() {
					$log.debug('Reset page input field');
					this.value = '';
				},
				onChange: function() {
					$scope.setPage(getAsInteger($scope.pageInput.value) - 1);
					this.reset();
				}
			}
			$scope.setPage = function setPage(page){
				$log.debug('Changing current page to ' + page);
				if(page !== '' && isFinite(page)){
					$scope.changePage()(page);
				}
			}

			$scope.$watch('itemsPerPage', function(newValue, oldValue){
				if(newValue === oldValue){
					return;
				}
				$scope.numberOfPages=getTotalNumberOfPages();
			});
			$scope.$watch('collectionSize', function(newValue, oldValue){
				if(newValue === oldValue){
					return;
				}
				$scope.numberOfPages = getTotalNumberOfPages();
			});

			function getAsInteger(actualValue){
				if(typeof actualValue === 'string' || actualValue instanceof String){
					return parseInt(actualValue);
				} else return actualValue;
			};
			function getTotalNumberOfPages() {
				var totalPages = Math.floor($scope.collectionSize / $scope.itemsPerPage);
				if($scope.collectionSize % $scope.itemsPerPage !=0){
					totalPages +=1;
				}
				return totalPages;
			};
		}
	};
});
