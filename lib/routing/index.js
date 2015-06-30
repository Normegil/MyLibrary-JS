'use strict';

var books = requireModule('books');
var log = requireModule('logger').init;

function setup(router){
	log.info('Register REST paths');
	books.setup(router);
}

function getRoutesList(){
	return [
		books.BASE_PATH
	];
}

module.exports = {
	setup: setup,
	getRoutesList: getRoutesList
};
