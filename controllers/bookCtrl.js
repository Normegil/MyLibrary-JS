var uuid = require('node-uuid');

var config = require('../config.js');
var log = require('../logger.js')
var errorCtrl = require('./errorCtrl');
var collectionController = require('./collectionCtrl.js');

var httpStatus = require('../httpStatus.js');
var BookSerie = require('../models/bookSerie.js');
var requestHelper = require('../helpers/request.js');


function getAll(request, response){
	var offset = requestHelper.getOffset(request, 0);
	var limit = requestHelper.getLimit(request, config.rest.collections.defaultLimit);

	if(limit > config.rest.collections.maxLimit){
		limit = config.rest.collections.maxLimit;
	}

	BookSerie.find()
		.sort({
			name: 'asc'
		})
		.skip(offset)
		.limit(limit)
		.select('_id')
		.exec(function(err, books){
			if(err) errorCtrl.handle(response, 50000, err);
			else {
				BookSerie.count(function(err, count){
					if(err) errorCtrl.handle(response, 50000, err);
					else collectionController.handle(response, requestHelper.geFullUrlSkippingParameters(request), offset, limit, count, books);
				});
			}
		});
};

function get(request, response){
	BookSerie.findById(request.params.uuid, function(err, book){
		if(err)	{
			errorCtrl.handle(response, 40400, err)
		}	else{
			book = book.toObject();
			book.href = requestHelper.geFullUrl(request);
			log.debug({send: book});
			delete book._id;
			response
				.status(httpStatus.ok)
				.json(book);
		}
	});
};

function create(request, response){
	var book = new BookSerie();
	book.uuid = uuid.v4();
	book.name = request.body.name;
	book.save(function(error){
		if(error) return errorCtrl.handle(response, 50000, error);
		response
			.status(httpStatus.created)
			.location(request.protocol + '://' + request.get('Host') + request.originalUrl + '/' + book.uuid)
			.send();
	});
};

function update(request, response){
	BookSerie.findById(request.params.uuid, function(error, book){
		if(error)	return errorCtrl.handle(response, 40400, error);
		if(request.body.name){
			book.name = request.boy.name;
		}

		book.save(function(error){
			if(error)return error.handle(response, 50000, error);
			response
				.status(httpStatus.ok)
				.send();
		});
	});
};

function remove(request, response){
	BookSerie.remove({
		uuid: request.params.uuid
	}, function(error, book){
		if(error) return errorCtrl.handle(response, 50000, error);
		response
			.status(httpStatus.ok)
			.send();
	});
};

module.exports.getAll = getAll;
module.exports.get = get;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
