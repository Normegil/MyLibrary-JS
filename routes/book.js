var BookCtrl = require('../controllers/bookCtrl.js');

var BASE_PATH = '/books';

function setup(router){
	router.route(BASE_PATH)
		.get(BookCtrl.getAll)
		.post(BookCtrl.create);

	router.route(BASE_PATH + '/:uuid')
		.get(BookCtrl.get)
		.put(BookCtrl.update)
		.delete(BookCtrl.remove);
}

module.exports.setup = setup;
module.exports.BASE_PATH = BASE_PATH;
