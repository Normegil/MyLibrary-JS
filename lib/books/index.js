'use strict';

var bookController = require('./bookCtrl.js');
var BookSerie = require('./bookSerie.js');
var log = requireModule('logger').init;

var BASE_PATH = '/books';

function setup(router){
	log.info('Register BookSerie Restpath to express router')
	router.route(BASE_PATH)
		.get(bookController.getAll)
		.post(bookController.create);

	router.route(BASE_PATH + '/:uuid')
		.get(bookController.get)
		.put(bookController.update)
		.delete(bookController.remove);
}

module.exports.setup = setup;
module.exports.BASE_PATH = BASE_PATH;
module.exports.BookSerie = BookSerie;
