'use strict';

angular
	.module('mylibrary')
	.directive('mlArrayInput', function($log, _){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModelController){
				ngModelController.$parsers.push(function parser(csvLine){
					$log.info('Test');
					return csvLine.split(';'); // View to Model
				});
				ngModelController.$formatters.push(function formatter(array){
					if(array !== undefined && array !== null){
						return _.reduce(array, function(memo, element){ return memo + ';' + element; });
					}
				});
			}
		};
	});
