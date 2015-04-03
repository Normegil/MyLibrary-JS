var MangaCtrl = require('../controllers/mangaCtrl');

var mangaRoutes = {
	setup: function(router){
		var BASE_PATH = '/mangas';
		router.route(BASE_PATH)
			.get(MangaCtrl.getAll)
			.post(MangaCtrl.create);

		router.route(BASE_PATH + '/:uuid')
			.get(MangaCtrl.get)
			.put(MangaCtrl.update)
			.delete(MangaCtrl.delete);
	}
}

module.exports = mangaRoutes;
