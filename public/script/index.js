'use strict';

var mylibrary = angular.module('mylibrary', [
	'ngResource',
	'ui.router',
	'ui.router.stateHelper',
	'ui.bootstrap',
	'ncy-angular-breadcrumb'
]);

mylibrary
	.config(function(stateHelperProvider, $urlRouterProvider, $breadcrumbProvider){

	 	$urlRouterProvider.when('', '/');
		$urlRouterProvider.otherwise('/notFound');

		var baseViewDirectory = 'views/';
		stateHelperProvider.state({
			name: 'home',
			url: '/',
			templateUrl: baseViewDirectory + 'home.html',
			controller: 'HomeController',
			ncyBreadcrumb: {
				label: 'News'
			}
		}).state({
			name: 'books',
			url: '/books',
			templateUrl: baseViewDirectory + 'books.html',
			controller: 'BooksController',
			ncyBreadcrumb: {
				label: 'Books'
			}
		}).state({
			name: 'booksDetail',
			url: '/books/:id',
			templateUrl: baseViewDirectory + 'bookDetail.html',
			controller: 'BookDetailController',
			ncyBreadcrumb: {
				parent: 'books',
				label: '{{bookSerie.title}}'
			}
		}).state({
			name: 'bookTomeDetail',
			url: '/books/:bookId/:tomeId',
			templateUrl: baseViewDirectory + 'bookTomeDetail.html',
			controller: 'BookTomeDetailController',
			ncyBreadcrumb: {
				parent: 'booksDetail',
				label: '{{bookTome.title}}'
			}
		}).state({
			name: 'notFound',
			url: '/notFound',
			templateUrl: baseViewDirectory + 'notFound.html',
			controller: 'NotFoundController',
			ncyBreadcrumb: {
				label: 'Not Found'
			}
		});

		$breadcrumbProvider.setOptions({
			templateUrl: baseViewDirectory + 'breadcrumb.html'
		});
	});
