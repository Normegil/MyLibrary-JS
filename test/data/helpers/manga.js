var logger = require('../../../logger');
var Manga = require('../../../models/manga');

var manga = {
	generate: function (numberOfManga){
		for(var i = 0;i< numberOfManga;i++){
			var manga = new Manga();
			manga.name = 'Manga' + i;	
			manga.save(function(error, manga){
				if(error){
					logger.error('Error - ' + manga.name + ' - ' + error);
				}else{
					logger.info('Saved - Manga - ' + manga.name);
				}
			});
		}
	},
	
	clean: function (){
		Manga.find(function(error, mangas){
			if(error){
				logger.error(error);
			}else{
				for(var i = 0 ; i < mangas.length ; i++){
					Manga.remove(mangas[i], function(error){
						if(error){
							logger.error(error);
						}else{
							logger.info('Removed - Manga');
						}
					});
				}
			}
		});
	}
}

module.exports = manga;