'use strict';

var config = requireModule('config');
var log = requireModule('logger').rest;
var rest = requireModule('rest');
var h = requireModule('helper');

var BookSerie = require('./bookSerie.js');
var requestHelper = h.request;

function getAll(request, response) {
  log.info(
    {req: request, res: response},
    'Receive GET all request for BookSerie');
  var getAllParameters = getGetAllRequestParameters();
  log.debug(getAllParameters, 'Parse collection parameters');
  log.debug('Building getAll query');
  var getAllQuery = getGetAllQuery(getAllParameters);

  getAllQuery.exec(function onSelect(err, books) {
    if (err) {
      log.error(
        {query: getAllQuery, err: err},
        'Error when trying to find requested BookSerie');
      rest.error.handle(response, 50000, err);
    } else {
      log.debug({query: getAllQuery, books: books}, 'BookSeries found');
      BookSerie.count(function onCount(err, count) {
        if (err) {
          log.error(
            {err: err},
            'Counting total number of BookSeries has failed');
          rest.error.handle(response, 50000, err);
        } else {
          log.debug('Use collectionController to build response');
          rest.collection.handle(
            response,
            requestHelper.getFullUrlSkippingParameters(request),
            getAllParameters.offset,
            getAllParameters.limit,
            count,
            books,
            getAllParameters.linksOnly
          );
        }
      });
    }
  });
}

function get(request, response) {
  log.info(
    {req: request, res: response},
    'Receive GET request for BookSerie: ' + request.params.id);
  BookSerie.findById(request.params.id, function onFound(err, book) {
    if (err) {
      log.error({err: err}, 'Get specific BookSerie has caused an error');
      rest.error.handle(response, 50000, err);
    } else if (h.exist(book)) {
      log.error({idBookSerie: request.params.id}, 'BookSerie not found');
      rest.error.handle(
        response,
        40400,
        new Error('BookSerie ' + request.params.id + ' not found'));
    } else {
      book = book.toObject();
      book.href = requestHelper.getFullUrl(request);
      log.debug({bookSerie: book}, 'BookSerie found: ' + request.params.id);
      response
        .status(rest.status.ok)
        .json(book);
    }
  });
}

function create(request, response) {
  log.info(
    {req: request, res: response},
    'Receive creation request for BookSerie');
  var book = new BookSerie();
  book = request.body;
  log.debug({bookSerie: book}, 'New BookSerie created');
  book.save(function onBookSaved(err) {
    if (err) {
      return rest.error.handle(response, 50000, err);
    }
    var location =
      request.protocol + '://' +
      request.get('Host') + request.originalUrl + '/' + book._id;
    log.debug({bookSerie: book, location: location}, 'New BookSerie saved');
    response
      .status(rest.status.created)
      .location(location)
      .send();
  });
}

function update(request, response) {
  log.info(
    {req: request, res: response},
    'Updating BookSerie ' + request.params.id);
  BookSerie.findById(request.params.id, function onFound(err, bookSerie) {
    if (err) {
      log.error(
        {err: err},
        'Error while loading BookSerie: ' + request.params.id);
      return rest.error.handle(response, 50000, err);
    } else if (!h.exist(bookSerie)) {
      var errorMsg = 'BookSerie ' + request.params.id + ' not found';
      log.error(errorMsg);
      return rest.error.handle(response, 40400, errorMsg);
    } else {
      updateBookSerie(bookSerie, request);
      log.debug(
        {bookSerie: bookSerie},
        'Finish updating BookSerie: ' + request.params.id);
      bookSerie.save(function onSave(err) {
        if (err) {
          log.error(
            {err: err},
            'Error while saving BookSerie: ' + request.params.id);
          return rest.error.handle(response, 50000, err);
        }
        log.debug(
          {err: err},
          'BookSerie updated and saved: ' + request.params.id);
        response
          .status(rest.status.ok)
          .send();
      });
    }
  });
}

function remove(request, response) {
  log.info(
    {req: request, res: response},
    'Deleting BookSerie ' + request.params.id);
  BookSerie.remove({_id: request.params.id}, function onRemoved(err) {
    if (err) {
      log.error(
        {err: err, idBooksSerie: request.params.id},
        'Error when deleting BookSerie: ' + request.params.id);
      return rest.error.handle(response, 50000, err);
    }
    log.info('Deleting BookSerie ' + request.params.id + ' done');
    response
      .status(rest.status.ok)
      .send();
  });
}

function getGetAllRequestParameters(request) {
  var offset = request.getOffset(request, 0);
  var limit = request.getLimit(request, config.rest.collections.defaultLimit);
  var linksOnly = request.getLinksOnly(request);
  if (limit > config.rest.collections.maxLimit) {
    limit = config.rest.collections.maxLimit;
  }
  return {offset: offset, limit: limit, linksOnly: linksOnly};
}

function getGetAllQuery(getAllParameters) {
  var query = BookSerie.find()
    .sort({
      name: 'asc',
    })
    .skip(getAllParameters.offset)
    .limit(getAllParameters.limit);
  if (getAllParameters.linksOnly) {
    query = query.select('_id');
  }
  return query;
}

function updateBookSerie(bookSerie, request) {
  bookSerie.isbn = request.body.isbn;
  bookSerie.title = request.body.title;
  bookSerie.alternativeTitles = request.body.alternativeTitles;
  bookSerie.description = request.body.description;
  bookSerie.tags = request.body.tags;
  bookSerie.urls = request.body.urls;
  bookSerie.books = request.body.books;
  bookSerie.status = request.body.status;
}

module.exports.getAll = getAll;
module.exports.get = get;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
