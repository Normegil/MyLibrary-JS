'use strict';

angular
	.module('mylibrary')
	.directive('mlBookForm', function($log){
		return {
			restrict: 'AEC',
			replace: 'true',
			templateUrl: 'directives/book/mlBookSerieForm/mlBookSerieForm.html',
			scope: {
				bookSerie: '='
			}
		};
	});
