'use strict';

var module = angular.module('mylibrary');

module.controller('MenuController', function($scope, $log, $modal, Alerts){
	$scope.alerts = Alerts;

	$scope.openAlert = function openAlert(){
		var modal = $modal.open({
			animation:true,
			controller: 'AlertsModalController',
			size: 'lg',
			templateUrl: 'alertModal.html'
		});
	};
});
