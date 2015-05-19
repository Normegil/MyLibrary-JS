'use strict';

angular
	.module('mylibrary')
	.directive('mlCollection', function($log){
		return {
			restrict: 'AEC',
			transclude: true,
			replace: 'true',
			templateUrl: 'script/directives/mlCollection/mlCollection.html',
			scope: {
				title: '=',

				currentPage: '=',
				defaultSize: '=',
				availableSizes: '=',
				numberOfItems: '=',

				displayNumberOfItems: '=',

				addElement: '&',
				refresh: '&'
			},
			controller: function($scope, $log){
				$scope.itemsPerPage = $scope.defaultSize;

				$scope.setPage= function setPage(page){
					$log.debug('Attempt to change currentPage to ' + page);
					var realPage = page - 1;
					if(realPage >= 0 && realPage < getTotalNumberOfPages()){
						$scope.currentPage = realPage;
						$scope.refresh()(
							$scope.currentPage,
							$scope.itemsPerPage
						);
					}
				};

				$scope.setItemsPerPage = function setItemsPerPage(size){
					var smallestSize = getSmallestAvailableSizes()
					if(size < smallestSize){
						$log.info('Change table size to ' + smallestSize)
						$scope.itemsPerPage = smallestSize;
					}else{
						$log.info('Change table size to ' + size)
						$scope.itemsPerPage = size;
					}
				};

				$scope.displayFooter = function displayFooter(){
					return $scope.displayNumberOfItems;
				};

				function getSmallestAvailableSizes(){
					var smallestSize;
					for (var i = 0; i < $scope.availableSizes.length; i++) {
						if(smallestSize === undefined || $scope.availableSizes[i] < smallestSize){
							smallestSize = $scope.availableSizes[i];
						}
					}
					return smallestSize;
				};

				function getTotalNumberOfPages() {
					var totalPages = Math.floor($scope.numberOfItems / $scope.itemsPerPage);
					if($scope.numberOfItems % $scope.itemsPerPage !=0){
						totalPages +=1;
					}
					return totalPages;
				}
			}
		};
	});
