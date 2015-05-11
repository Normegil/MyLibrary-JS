angular
	.module('mylibrary')
	.factory('Book', function($resource) {
		return $resource('/rest/books/:id', {
			id: '@id'
		}, {
			'query': {
				method: 'GET',
				isArray: false
			}
		});
	});
