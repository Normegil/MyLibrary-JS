angular
	.module('mylibrary')
	.factory('BookSerie', function($resource) {
		return $resource('/rest/books/:id', {
			id: '@id'
		}, {
			'query': {
				method: 'GET',
				isArray: false
			},
			'update': {
				method: 'PUT'
			}
		});
	});
