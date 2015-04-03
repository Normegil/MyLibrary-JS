var uuid = require('node-uuid');

var errorCtrl = require('./errorCtrl');
var collectionController = require('./collectionController');

var httpStatus = require('../httpStatus.js');
var Manga = require('../models/manga');

var mangaCtrl = {

	getAll: function(request, response){
        var offset = request.query.offset;
        var limit = request.query.limit;
        
		Manga.find(function(error, mangas){
			if(error){
                errorCtrl.handle
            }
            
            collectionController.handle(response, offset, limit, Manga.count(), mangas);
		});
        
	},

	get: function(request, response){
		Manga.findById(request.params.uuid, function(error, manga){
			if(error){
				errorCtrl.handle(response, 40400, error);
			}
			
			manga.set('href', request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + manga.uuid)
			delete manga.uuid;

			response
				.status(httpStatus.ok)
				.json(manga);
		});
	},

	create: function(request, response){
		var manga = new Manga();
		manga.uuid = uuid.v4();
		manga.name = request.body.name;
		manga.save(function(error){
			if(error){
				errorCtrl.handle(response, 50000, error);
			}else{
				response
					.status(httpStatus.created)
					.location(request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + manga.uuid)
					.send();
			}
		});
	},

	update: function(request, response){
		Manga.findById(request.params.uuid, function(error, manga){
			if(error){
				errorCtrl.handle(response, 40400, error)
			}else{
				if(request.body.name){
					manga.name = request.boy.name;
				}

				manga.save(function(error){
					if(error){
						error.handle(response, 50000, error);
					}else{
						response
							.status(httpStatus.ok)
							.send();
					}
				});
			}
		});
	},

	delete: function(request, response){
		Manga.remove({
			uuid: request.params.uuid
		}, function(error, manga){
			if(error){
				errorCtrl.handle(response, 50000, error);
			}else{
				response
					.status(httpStatus.ok)
					.send();
			}
		});
		
	}

}

module.exports = mangaCtrl;
