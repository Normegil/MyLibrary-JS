'use strict';

var module = angular.module('mylibrary');

module.controller('AlertsModalController', function($scope, $log, $modalInstance, Alerts){
	$scope.alerts = Alerts;

	for(var i=0;i<$scope.alerts.list.length;i++){
		$scope.alerts.list[i].collapsed = true;
	};

	$scope.toggleCollapseStatus = function toggleCollapseStatus($index){
		$scope.alerts.list[$index].collapsed = !$scope.alerts.list[$index].collapsed;
	}

	$scope.ok = function(){
		$modalInstance.close();
	}

	$scope.reset = function(){
		Alerts.list = [];
		$modalInstance.close();
	}
});
