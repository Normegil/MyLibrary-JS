var uuid = require('node-uuid');

var config = require('../config.js');
var log = require('../logger.js')
var errorCtrl = require('./errorCtrl');
var collectionController = require('./collectionCtrl.js');

var httpStatus = require('../httpStatus.js');
var Manga = require('../models/manga');
var requestHelper = require('../helpers/request.js');

var mangaCtrl = {
	getAll: function(request, response){
		var offset = requestHelper.getOffset(request, 0);
		var limit = requestHelper.getLimit(request, config.rest.collections.defaultLimit);

		if(limit > config.rest.collections.maxLimit){
			limit = config.rest.collections.maxLimit;
		}

		Manga.find()
			.sort({
				name: 'asc'
			})
			.skip(offset)
			.limit(limit)
			.select('_id')
			.exec(function(err, mangas){
				if(err) errorCtrl.handle(response, 50000, err);
				else {
					Manga.count(function(err, count){
						if(err) errorCtrl.handle(response, 50000, err);
						else collectionController.handle(response, requestHelper.geFullUrlSkippingParameters(request), offset, limit, count, mangas);
					});
				}
			});
	},

	get: function(request, response){
		Manga.findById(request.params.uuid, function(err, manga){
			if(err)	{
				errorCtrl.handle(response, 40400, err)
			}	else{
				manga = manga.toObject();
				manga.href = requestHelper.geFullUrl(request);
				delete manga._id;
				log.debug({send: manga});
				response
					.status(httpStatus.ok)
					.json(manga);
			}
		});
	},

	create: function(request, response){
		var manga = new Manga();
		manga.uuid = uuid.v4();
		manga.name = request.body.name;
		manga.save(function(error){
			if(error) return errorCtrl.handle(response, 50000, error);
			response
				.status(httpStatus.created)
				.location(request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + manga.uuid)
				.send();
		});
	},

	update: function(request, response){
		Manga.findById(request.params.uuid, function(error, manga){
			if(error)	return errorCtrl.handle(response, 40400, error);
			if(request.body.name){
				manga.name = request.boy.name;
			}

			manga.save(function(error){
				if(error)return error.handle(response, 50000, error);
				response
					.status(httpStatus.ok)
					.send();
			});
		});
	},

	delete: function(request, response){
		Manga.remove({
			uuid: request.params.uuid
		}, function(error, manga){
			if(error) return errorCtrl.handle(response, 50000, error);
			response
				.status(httpStatus.ok)
				.send();
		});
	}
}

module.exports = mangaCtrl;
