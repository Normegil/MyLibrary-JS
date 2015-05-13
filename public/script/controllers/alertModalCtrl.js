'use strict';

var module = angular.module('mylibrary');

module.controller('AlertsModalController', function($scope, $log, $modalInstance, Alerts){
	$scope.alerts = Alerts;

	$scope.ok = function(){
		$modalInstance.close();
	}

	$scope.reset = function(){
		Alerts.list = [];
		$modalInstance.close();
	}
});
