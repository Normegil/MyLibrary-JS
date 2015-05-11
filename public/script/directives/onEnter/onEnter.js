'use strict';

angular
	.module('mylibrary')
	.directive('onEnter', function(){
		return function(scope, element, attrs) {
			element.bind('keypress', function(event){
				if(event.which === 13){
					scope.$apply(function(){
						scope.$eval(attrs.onEnter, {'event' : event})
					});
				}
			});
		};
	});
