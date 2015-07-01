'use strict';

angular
  .module('mylibrary')
  .directive('mlArrayInput', ['_', '$log', function mlArrayInputController(_, $log) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function parser(csvLine) {
          $log.info('Test');
          return csvLine.split(';'); // View to Model
        });
        ngModelController.$formatters.push(function formatter(array) {
          if (undefined !== array && null !== array) {
            return _.reduce(array, function reduce(memo, element) {
              return memo + ';' + element;
            });
          }
        });
      }
    };
  }]);
