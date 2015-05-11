'use strict';

var module = angular.module('mylibrary');

module.directive('mlPagination', function($log){
	return {
		restrict: 'AEC',
		replace: 'true',
		templateUrl: 'script/directives/mlPagination/mlPagination.html',
		scope: {
			elementPerPage: '=',
			collectionSize: '=',
			changePage: '&'
		},
		controller: function($scope){
			const DEFAULT_PAGE = 1;
			$scope.currentPage = DEFAULT_PAGE;

			$scope.getTotalNumberOfPages = function() {
				var totalPages = Math.floor($scope.collectionSize / $scope.elementPerPage);
				if($scope.collectionSize % $scope.elementPerPage !=0){
					totalPages +=1;
				}
				return totalPages;
			};
			$scope.numberOfPages = $scope.getTotalNumberOfPages();


			$scope.pageInput= {
				value: '',

				reset: function() {
					$log.debug('MlPagination - Reset page input field');
					this.value = '';
				},

				onChange: function() {
					$scope.setPage(getAsInteger($scope.pageInput.value));
					this.reset();
				}
			}

			$scope.setPage = function(page){
				$log.debug('MlPagination - Changing current page to ' + page);
				if(page !== '' && isFinite(page)){
					if(page < 1){
						page = 1;
					}else if(page > $scope.getTotalNumberOfPages()){
						page = $scope.getTotalNumberOfPages();
					}

					if($scope.currentPage !== page){
						$scope.currentPage = page;
						$scope.changePage()(page);
					}
				}
			}

			$scope.$watch('elementPerPage', function(newValue, oldValue){
				console.log('elementPerPage: ' + newValue + ';' + oldValue);
				if(newValue === oldValue){
					return;
				}
				$scope.numberOfPages =$scope.getTotalNumberOfPages();
				var oldPage = $scope.currentPage;
				$scope.setPage(DEFAULT_PAGE);
				if(oldPage === DEFAULT_PAGE){
					$scope.changePage()($scope.currentPage);
				}
			});

			$scope.$watch('collectionSize', function(newValue, oldValue){
				console.log('collectionSize: ' + newValue + ';' + oldValue);
				if(newValue === oldValue){
					return;
				}
				$scope.numberOfPages = $scope.getTotalNumberOfPages();
				$scope.setPage($scope.currentPage); //If overflow, it will be corrected
			});

			function getAsInteger(actualValue){
				if(typeof actualValue === 'string' || actualValue instanceof String){
					return parseInt(actualValue);
				} else return actualValue;
			}
		}
	};
});
