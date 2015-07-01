'use strict';

angular
  .module('mylibrary')
  .directive('mlCollection', [function mlCollectionController() {
    return {
      restrict: 'AEC',
      transclude: true,
      replace: 'true',
      templateUrl: 'directives/mlCollection/mlCollection.html',
      scope: {
        title: '=',

        currentPage: '=',
        itemsPerPage: '=',
        collectionSize: '=',
        availableSizes: '=',

        displayNumberOfItems: '=',

        addElement: '&',
        refresh: '&'
      },
      controller: function directiveController($scope, $log, _) {
        $scope.smallestAvalaibleSize = _.min($scope.availableSizes);
        $scope.changePage = function changePage(page, forceRefresh) {
          $log.debug('Attempt to change currentPage to ' + page + '(CurrentPage: ' + $scope.currentPage + ')');
          if (0 > page) {
            page = 0;
          } else if (page >= getTotalNumberOfPages()) {
            page = getTotalNumberOfPages() - 1;
          }
          if ($scope.currentPage !== page || forceRefresh) {
            $scope.currentPage = page;
            $scope.refresh()($scope.currentPage, $scope.itemsPerPage);
          }
        };
        $scope.setItemsPerPage = function setItemsPerPage(size) {
          var smallestSize = _.min($scope.availableSizes);
          if (size < smallestSize) {
            $scope.itemsPerPage = smallestSize;
          } else {
            $scope.itemsPerPage = size;
          }
          $log.info('Change table size to ' + $scope.itemsPerPage);
          $scope.changePage(0, true);
        };
        $scope.displayFooter = function displayFooter() {
          return $scope.displayNumberOfItems;
        };

        $scope.$watch('collectionSize', function onCollectionSizeChange(newValue, oldValue) {
          $log.debug('CollectionSize updated: ' + oldValue + '->' + newValue);
          if (newValue === oldValue) {
            return;
          }
          $scope.changePage($scope.currentPage); //If overflow, it will be corrected
        });

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
