'use strict';

angular
  .module('mylibrary')
  .directive('mlDateInput', function mlDateInputController($log, moment) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function link(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function toIsoDate(inputDate) {
          var date = moment(inputDate).format();
          $log.info('toIsoDate:' + inputDate + '->' + date);
          return date;
        });
        ngModelController.$formatters.push(function toRepresentationDate(isoDate) {
          if (undefined !== isoDate && null !== isoDate) {
            var formatteDate = moment(isoDate).format('YYYY-MM-DD');
            $log.info('toDate:' + isoDate + '->' + formatteDate);
            return formatteDate;
          }
        });
      }
    };
  });
