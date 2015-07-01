'use strict';

angular
  .module('mylibrary')
  .controller('BookDetailController', ['$scope', '$log', 'BookSerie', 'Alerts', '$stateParams', '_',
    function bookDetailController($scope, $log, BookSerie, Alerts, $stateParams, _) {
      $scope.book = {};

      BookSerie.get({id: $stateParams.serieId}, function onSuccess(bookSerie) {
        $scope.bookSerie = bookSerie;
        var books = _.filter(bookSerie.books, function filter(book) {
          return book._id === $stateParams.bookId;
        });
        $scope.book = _.reduce(books, function reduce(memo, book) {
          if (undefined !== book) {
            $log.error('Book not undefined:' + books);
          } else {
            return memo;
          }
        });
      }, function onError(err) {
        Alerts.add('warning', err.data);
      });
    },
  ]);
