var uuid = require('node-uuid');

var config = requireModule('config');
var log = requireModule('logger');
var rest = requireModule('rest');
var requestHelper = requireModule('helper').request;

var BookSerie = require('./bookSerie.js');

var errorCtrl = rest.error;
var collectionController = rest.collection;
var httpStatus = rest.status;

function getAll(request, response){
	var offset = requestHelper.getOffset(request, 0);
	var limit = requestHelper.getLimit(request, config.rest.collections.defaultLimit);
	try{
		var linksOnly = requestHelper.getLinksOnly(request);
		log.debug({LinksOnly: linksOnly}, typeof linksOnly);
		if(limit > config.rest.collections.maxLimit){
			limit = config.rest.collections.maxLimit;
		}

		var query = BookSerie.find()
			.sort({
				name: 'asc'
			})
			.skip(offset)
			.limit(limit);
			if(linksOnly){
				query = query.select('_id');
			}

			query.exec(function(err, books){
				if(err) errorCtrl.handle(response, 50000, err);
				else {
					BookSerie.count(function(err, count){
						if(err) errorCtrl.handle(response, 50000, err);
						else collectionController.handle(
							response,
							requestHelper.getFullUrlSkippingParameters(request),
							offset,
							limit,
							count,
							books,
							linksOnly
						);
					});
				}
			});
		} catch(e){
			errorCtrl.handle(response, 40001, e);
		}
};

function get(request, response){
	BookSerie.findById(request.params.uuid, function(err, book){
		if(err)	{
			errorCtrl.handle(response, 40400, err)
		}	else{
			book = book.toObject();
			book.href = requestHelper.getFullUrl(request);
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
