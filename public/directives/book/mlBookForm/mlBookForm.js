'use strict';

angular
	.module('mylibrary')
	.directive('mlBookForm', function($log){
		return {
			restrict: 'AEC',
			replace: 'true',
			templateUrl: 'directives/book/mlBookForm/mlBookForm.html',
			scope: {
				book: '='
			},
			controller: function($scope){
				$scope.datePicker = {
					opened: false,
					open: function($event){
						$event.preventDefault();
						$event.stopPropagation();
						$scope.datePicker.opened = true;
					}
				};
			}
		};
	});
