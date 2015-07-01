'use strict';

angular
  .module('mylibrary')
  .controller('AddBookModalController',
      ['$scope', '$log', '$modalInstance', 'serieId', 'bookId', 'Alerts', 'BookSerie', '_',
      // jscs:disable maximumLineLength
      function addBookModalController($scope, $log, $modalInstance, serieId, bookId, Alerts, BookSerie, _) {
        // jscs:enable maximumLineLength
        var originalBook = {};
        $scope.book = {};
        $scope.title = 'Add a book';
        if (undefined !== serieId && null !== serieId) {
          $scope.bookSerie = BookSerie.get({id: serieId}, function onLoad(bookSerie) {
            $scope.bookSerie = bookSerie;
            if (undefined !== bookId && null !== bookId) {
              var book = _.find($scope.bookSerie.books, function find(book) {
                return bookId === book._id;
              });
              $scope.book = angular.copy(book);
              originalBook = angular.copy(book);
              $scope.title = bookSerie.title + ' - Edit ' + $scope.book.title;
            } else {
              $scope.title = bookSerie.title + ' - Add a Book';
            }
          }, function onError(err) {
            Alerts.add('warning', err.data);
          });
        }

        $scope.ok = function ok() {
          if (undefined !== bookId && null !== bookId) {
            var book = _.find($scope.bookSerie.books, function find(book) {
              return bookId === book._id;
            });
            angular.copy($scope.book, book);
          } else {
            $scope.bookSerie.books.push($scope.book);
          }
          $scope.bookSerie.$update({id: serieId}, function onSuccess() {
            $log.info('Book saved');
            $modalInstance.close();
          }, function onError(err) {
            Alerts.add('warning', err.data);
            $modalInstance.close();
          });
        };

        $scope.reset = function reset() {
          $scope.book = angular.copy(originalBook);
        };
      },
    ]).value('bookId', null);
