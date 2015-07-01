'use strict';

angular
  .module('mylibrary')
  .directive('mlBookForm', [function mlBookFormController() {
    return {
      restrict: 'AEC',
      replace: 'true',
      templateUrl: 'directives/book/mlBookForm/mlBookForm.html',
      scope: {
        book: '='
      },
      controller: function directiveController($scope) {
        $scope.datePicker = {
          opened: false,
          open: function open($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.datePicker.opened = true;
          }
        };
      }
    };
  }]);
