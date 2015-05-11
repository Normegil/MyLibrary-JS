var log = require('../logger.js');
var httpStatus = require('../httpStatus.js');

function handle(response, baseUrl, givenOffset, givenLimit, totalNumberofItemsInDB, records){
	response
		.status(httpStatus.ok)
		.json({
			items: getItems(baseUrl, records),

			offset: givenOffset,
			limit: givenLimit,
			totalNumberOfItems: totalNumberofItemsInDB,

			first: generateCollectionUrl(baseUrl, 0, givenLimit),
			previous: generatePreviousUrl(baseUrl, givenOffset, givenLimit),
			next: generateNextUrl(baseUrl, givenOffset, givenLimit, totalNumberofItemsInDB),
			last: generateCollectionUrl(baseUrl, getLastOffset(givenLimit, totalNumberofItemsInDB), givenLimit)
		});
}

function generateCollectionUrl(baseUrl, offset, limit){
	return baseUrl + '?offset=' + offset + '&limit=' + limit;
}

function generatePreviousUrl(baseUrl, offset, limit){
	var calculatedOffset = offset - limit;
	if (calculatedOffset >= 0) {
		return generateCollectionUrl(baseUrl, calculatedOffset, limit);
	} else if (calculatedOffset < 0 && offset > 0) {
		return generateCollectionUrl(baseUrl, 0, limit);
	} else {
		return '';
	}

}

function generateNextUrl(baseUrl, offset, limit, totalNumberOfItems){
	var calculatedOffset = offset + limit;
	return calculatedOffset < totalNumberOfItems ?
		generateCollectionUrl(baseUrl, calculatedOffset, limit)
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

function getItems(baseUrl, records){
	var items = [];
	for(var i=0 ; i<records.length ; i++){
		var item = {href: baseUrl + '/' + records[i]._id};
		items.push(item)
	}
	return items;
}

module.exports.handle = handle;
