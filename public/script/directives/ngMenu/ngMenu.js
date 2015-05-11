'use strict';

var module = angular.module('mylibrary');
module.directive('ngMenu', function(){
	return {
		restrict:'AEC',
		replace:'true',
		templateUrl:'./ngMenu.html'
		scope:{	active: '=active' }
	};
});