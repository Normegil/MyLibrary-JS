'use strict';

angular
  .module('mylibrary')
  .directive('mlPagination', ['$log', function mlPaginationController($log) {
    return {
      restrict: 'AEC',
      replace: 'true',
      templateUrl: 'directives/mlPagination/mlPagination.html',
      scope: {
        currentPage: '=',
        itemsPerPage: '=',
        collectionSize: '=',
        changePage: '&'
      },
      controller: function directiveController($scope) {
        $scope.numberOfPages = getTotalNumberOfPages();
        $scope.pageInput = {
          value: '',
          reset: function reset() {
            $log.debug('Reset page input field');
            this.value = '';
          },
          onChange: function onChange() {
            $scope.setPage(getAsInteger($scope.pageInput.value) - 1);
            this.reset();
          }
        };
        $scope.setPage = function setPage(page) {
          $log.debug('Changing current page to ' + page);
          if ('' !== page && isFinite(page)) {
            $scope.changePage()(page);
          }
        };

        $scope.$watch('itemsPerPage', function onItemsPerPageChange(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          $scope.numberOfPages = getTotalNumberOfPages();
        });
        $scope.$watch('collectionSize', function onCollectionSizeChange(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          $scope.numberOfPages = getTotalNumberOfPages();
        });

        function getAsInteger(actualValue) {
          if ('string' === typeof actualValue || actualValue instanceof String) {
            return parseInt(actualValue);
          } else {
            return actualValue;
          }
        }
        function getTotalNumberOfPages() {
          var totalPages = Math.floor($scope.collectionSize / $scope.itemsPerPage);
          if (0 !== $scope.collectionSize % $scope.itemsPerPage) {
            totalPages += 1;
          }
          return totalPages;
        }
      }
    };
  }]);
