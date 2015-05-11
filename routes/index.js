var bookRoutes = require('./book.js');

function setup(router){
	bookRoutes.setup(router);
}

function getRoutesList(){
	return [
		bookRoutes.BASE_PATH
	];
}

module.exports.setup = setup;
module.exports.getRoutesList = getRoutesList;
