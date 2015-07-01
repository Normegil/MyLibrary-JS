'use strict';

angular
  .module('mylibrary')
  .controller('AlertsModalController', ['$scope', '$log', '$modalInstance', 'Alerts',
    function AlertsModalController($scope, $log, $modalInstance, Alerts) {
      $scope.alerts = Alerts;

      for (var i = 0;i < $scope.alerts.list.length;i++) {
        $scope.alerts.list[i].collapsed = true;
      }

      $scope.toggleCollapseStatus = function toggleCollapseStatus($index) {
        $scope.alerts.list[$index].collapsed = !$scope.alerts.list[$index].collapsed;
      };

      $scope.ok = function okButton() {
        $modalInstance.close();
      };

      $scope.reset = function resetButton() {
        Alerts.list = [];
        $modalInstance.close();
      };
    },
	]);
