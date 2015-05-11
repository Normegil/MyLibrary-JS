'use strict';

var mylibrary = angular.module('mylibrary', [
	'ngResource',
	'ui.router',
	'ui.bootstrap',
	'ncy-angular-breadcrumb'
]);

mylibrary
	.config(function($stateProvider, $urlRouterProvider, $breadcrumbProvider){

	 	$urlRouterProvider.when('', '/');
		$urlRouterProvider.otherwise('/notFound');

		var baseViewDirectory = 'views/';
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: baseViewDirectory + 'home.html',
				controller: 'HomeController',
				ncyBreadcrumb: {
					label: 'News'
				}
			})
			.state('books', {
				url: '/books',
				templateUrl: baseViewDirectory + 'books.html',
				controller: 'BooksController',
				ncyBreadcrumb: {
					label: 'Books'
				}
			})
			.state('booksDetail', {
				url: '/books/:id',
				templateUrl: baseViewDirectory + 'books.html',
				controller: 'BooksController',
				ncyBreadcrumb: {
					label: 'Books'
				}
			})
			.state('notFound', {
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
