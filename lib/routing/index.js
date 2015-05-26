var books = requireModule('books');

function setup(router){
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
}
