'use strict';

var log = requireModule('logger').rest;
var config = requireModule('config');
var httpStatus = require('./httpStatus.js');

function handle(response, collectionOptions){
	log.debug({options: collectionOptions}, 'Building response: collection body');
	var baseUrl = collectionOptions.url;
	var offset = collectionOptions.offset;
	var limit = collectionOptions.limit || config.rest.collections.defaultLimit;
	var totalNumberOfItems = collectionOptions.totalNumberOfItems;

	var responseBody = {
		items: getItems(baseUrl, collectionOptions.records, collectionOptions.linksOnly),
		offset: offset,
		limit: limit,
		totalNumberOfItems: totalNumberOfItems,
		first: generateCollectionUrl(baseUrl, 0, limit),
		previous: generatePreviousUrl(baseUrl, offset, limit),
		next: generateNextUrl(baseUrl, offset, limit, totalNumberOfItems),
		last: generateCollectionUrl(baseUrl, getLastOffset(limit, totalNumberOfItems), limit)
	};

	log.debug({response: responseBody}, 'Collection response build');
	response
		.status(httpStatus.ok)
		.json(responseBody);
}

function generateCollectionUrl(urlOptions){
	return urlOptions.url + '?offset=' + urlOptions.offset + '&limit=' + urlOptions.limit;
}

function generatePreviousUrl(urlOptions){
	var calculatedOffset = urlOptions.offset - urlOptions.limit;
	if (calculatedOffset >= 0) {
		return generateCollectionUrl(urlOptions.url, calculatedOffset, urlOptions.limit);
	} else if (calculatedOffset < 0 && urlOptions.offset > 0) {
		return generateCollectionUrl(urlOptions.url, 0, urlOptions.limit);
	} else {
		return '';
	}
}

function generateNextUrl(urlOptions){
	var calculatedOffset = urlOptions.offset + urlOptions.limit;
	return calculatedOffset < urlOptions.totalNumberOfItems ?
		generateCollectionUrl(urlOptions.url, calculatedOffset, urlOptions.limit)
		: '';
}

function getLastOffset(limit, totalNumberOfItems){
	var numberOfPages = Math.floor(totalNumberOfItems / limit);
	if(totalNumberOfItems % limit === 0){
		numberOfPages -= 1;
	}
	var offset = numberOfPages * limit;
	return offset;
}

function getItems(baseUrl, records, linksOnly){
	var items = [];
	for(var i=0 ; i<records.length ; i++){
		var item;
		if(linksOnly){
			item = {href: baseUrl + '/' + records[i]._id};
		} else {
			item = records[i].toObject();
			item.href = baseUrl + '/' + records[i]._id;
		}
		items.push(item);
	}
	return items;
}

module.exports.handle = handle;
