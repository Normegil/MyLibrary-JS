angular
	.module('mylibrary')
	.factory('Manga', function($resource) {
		return $resource('/rest/mangas/:id', {
			id: '@id'
		}, {
			'query': {
				method: 'GET',
				isArray: false
			}
		});
	});
