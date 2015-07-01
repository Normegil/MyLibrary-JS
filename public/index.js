'use strict';

angular.module('mylibrary', [
  'ngResource',
  'ui.router',
  'ui.router.stateHelper',
  'ui.bootstrap',
  'ncy-angular-breadcrumb',
]).config(['stateHelperProvider', '$urlRouterProvider', '$breadcrumbProvider',
  function configApplication(stateHelperProvider, $urlRouterProvider, $breadcrumbProvider) {
    $urlRouterProvider.when('', '/news');
    $urlRouterProvider.otherwise('/notFound');

    stateHelperProvider.state({
      name: 'news',
      url: '/news',
      templateUrl: 'modules/home/home.html',
      controller: 'HomeController',
      ncyBreadcrumb: {
        label: 'News',
      },
    }).state({
      name: 'bookSeriesList',
      url: '/books',
      templateUrl: 'modules/book/bookSeriesList/bookSeriesList.html',
      controller: 'BookSeriesListController',
      ncyBreadcrumb: {
        label: 'Books',
      },
    }).state({
      name: 'bookSerieDetail',
      url: '/books/:id',
      templateUrl: 'modules/book/bookSerieDetails/bookSerieDetails.html',
      controller: 'BookSerieDetailsController',
      ncyBreadcrumb: {
        parent: 'bookSeriesList',
        label: '{{bookSerie.title}}',
      },
    }).state({
      name: 'bookDetail',
      url: '/books/:serieId/:bookId',
      templateUrl: 'modules/book/bookDetail/bookDetail.html',
      controller: 'BookDetailController',
      ncyBreadcrumb: {
        parent: 'bookSerieDetail',
        label: '{{bookTome.title}}',
      },
    }).state({
      name: 'notFound',
      url: '/notFound',
      templateUrl: 'module/notFound/notFound.html',
      controller: 'NotFoundController',
      ncyBreadcrumb: {
        label: 'Not Found',
      },
    });

    $breadcrumbProvider.setOptions({
      templateUrl: 'modules/breadcrumb/breadcrumb.html',
    });
  }
]).controller('MenuController', function menuController($scope, $modal, Alerts) {
  $scope.alerts = Alerts;

  $scope.openAlert = function openAlert() {
    $modal.open({
      animation: true,
      controller: 'AlertsModalController',
      size: 'lg',
      templateUrl: 'modules/alert/alertModal.html'
    });
  };
});
