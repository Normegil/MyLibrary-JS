'use strict';

angular
  .module('mylibrary')
  .controller('BookSerieDetailsController',
    ['$scope', '$log', 'BookSerie', 'Alerts', '$stateParams', '_', '$modal',
    function bookSerieDetailsController($scope, $log, BookSerie, Alerts, $stateParams, _, $modal) {
      // jshint maxstatements:false
      $scope.bookSerie = {};
      $scope.booksList = {
        title: 'Books',
        displayedBooks: [],
        currentPage: 0,
        itemsPerPage: 7,
        availableSizes: [
          7,
          10,
          20,
          50,
          100,
          500,
        ],
        totalNumberOfItems: 0,

        refresh: function refresh(page, size) {
          $log.info('Refreshing Book Table with page ' + page + ' and size ' + size);
          BookSerie.get({id: $stateParams.id}, function onSuccess(bookSerie) {
            $scope.bookSerie = bookSerie;
            $scope.bookSerie.dbId = getUUID(bookSerie.href);
            $scope.booksList.displayedBooks = [];
            $scope.booksList.displayedBooks = getListFrom(
              bookSerie.books,
              page * size,
              size
            );
            $log.debug('bookSerie.dbId:' + $scope.bookSerie.dbId);
            $scope.booksList.totalNumberOfItems = undefined !== $scope.bookSerie.books ?
              $scope.bookSerie.books.length : 0;
          }, function onError(err) {
            Alerts.add('warning', err.data);
          });
        },
      };

      $scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);

      $scope.getAuthors = function getAuthors(bookSerie) {
        if (undefined !== bookSerie && undefined !== bookSerie.books) {
          var authorsWithDuplicates = _.map(bookSerie.books, function map(book) {
            return book.authors;
          });
          return removeDuplicates(authorsWithDuplicates);
        }
      };

      $scope.getGenres = function getGenres(bookSerie) {
        if (undefined !== bookSerie && undefined !== bookSerie.books) {
          var genresWithDuplicates = _.map(bookSerie.books, function map(book) {
            return book.genres;
          });
          return removeDuplicates(genresWithDuplicates);
        }
      };

      $scope.getEarliestReleaseDate = function getEarliestReleaseDate(bookSerie) {
        if (undefined !== bookSerie && undefined !== bookSerie.books) {
          var date;
          for (var i = 0;i < bookSerie.books.length;i++) {
            date = getEarliestDate(date, bookSerie.books[i].releaseDate);
          }
          return date;
        }
      };

      $scope.getLastReleaseDate = function getLastReleaseDate(bookSerie) {
        if (undefined !== bookSerie && undefined !== bookSerie.books) {
          var date;
          for (var i = 0;i < bookSerie.books.length;i++) {
            date = getLastDate(date, bookSerie.books[i].releaseDate);
          }
          return date;
        }
      };

      $scope.addBook = function addBook() {
        var modal = $modal.open({
          animation: true,
          controller: 'AddBookModalController',
          size: 'lg',
          templateUrl: 'modules/book/addBookModal/addBookModal.html',
          resolve: {
            serieId: function getSerieId() {
              return $scope.bookSerie.dbId;
            },
          },
        });
        modal.result.then(function onSuccess() {
          $scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
        });
      };
      $scope.editBook = function editBook(e, bookId) {
        e.stopPropagation();
        var modal = $modal.open({
          animation: true,
          controller: 'AddBookModalController',
          size: 'lg',
          templateUrl: 'modules/book/addBookModal/addBookModal.html',
          resolve: {
            serieId: function getSerieId() {
              return $scope.bookSerie.dbId;
            },
            bookId: function getBookId() {
              return bookId;
            },
          },
        });
        modal.result.then(function onSuccess() {
          $scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
        });
      };
      $scope.removeBook = function removeBook(e, gID) {
        e.stopPropagation();
        $scope.bookSerie.books = _.filter($scope.bookSerie.books, function filter(book) {
          return book._id !== gID;
        });
        $scope.bookSerie.$update({id: $scope.bookSerie.dbId}, function onSuccess() {
          $scope.booksList.refresh($scope.booksList.currentPage, $scope.booksList.itemsPerPage);
        }, function onError(err) {
          $log.error(err);
          $scope.alerts.add('warning', err.data);
        });
      };

      function getEarliestDate(date1, date2) {
        if (undefined !== date1 && undefined !== date2) {
          if (new Date(date1).getTime() <= new Date(date2).getTime()) {
            return date1;
          } else if (new Date(date1).getTime() > new Date(date2).getTime()) {
            return date2;
          }
        } else {
          return getExistingDate(date1, date2);
        }
      }
      function getLastDate(date1, date2) {
        if (undefined !== date1 && undefined !== date2) {
          if (new Date(date1).getTime() >= new Date(date2).getTime()) {
            return date1;
          } else if (new Date(date1).getTime() < new Date(date2).getTime()) {
            return date2;
          }
        } else {
          return getExistingDate(date1, date2);
        }
      }

      function getExistingDate(date1, date2) {
        if (undefined === date1 && undefined === date2) {
          return undefined;
        } else if (undefined === date1 && undefined !== date2) {
          return date2 ;
        } else if (undefined !== date1 && undefined === date2) {
          return date1;
        }
      }

      function getListFrom(books, offset, limit) {
        if (0 > offset || offset >= books.length) {
          $log.error('Offset incorrect: ' + offset);
        } else if (0 >= limit) {
          $log.error('Offset incorrect: ' + offset);
        } else {
          var sortedBooks = _.sortBy(books, function sortBy(book) {
            return new Date(book.releaseDate).getTime();
          });
          var booksToReturn = [];
          for (var i = offset;i < sortedBooks.length && i - offset < limit;i++) {
            booksToReturn.push(sortedBooks[i]);
          }
          return booksToReturn;
        }
      }

      function removeDuplicates(collectionWithDuplicates) {
        var result = [];
        _.each(collectionWithDuplicates, function forEach(item) {
          if (!_.contains(result, item)) {
            result.push(item);
          }
        });
        return result;
      }

      function getUUID(url) {
        var splittedUrl = url.split('/');
        return splittedUrl[splittedUrl.length - 1];
      }
    },
  ]);
