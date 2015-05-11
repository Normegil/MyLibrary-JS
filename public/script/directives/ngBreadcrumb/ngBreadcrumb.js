'use strict';

var module = angular.module('mylibrary');

module.directive('ngBreadcrumb', function(){
	return {
		restrict: 'AEC',
		replace: 'true',
		templateUrl: 'script/directives/ngBreadcrumb/ngBreadcrumb.html',
		scope: {
			Items: '=feed'
		}
	};
});