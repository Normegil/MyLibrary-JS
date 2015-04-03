var httpStatus = require('../httpStatus.js')

var CollectionController = {
    
    handle: function(response, baseUrl, offset, limit, totalNumberofItems, records){
        response
            .status(httpStatus.ok)
            .json({
                items: getItems(records),
            
                offset:offset,
                limit:limit,
                totalNumberOfItems:totalNumberofItems,
            
                first: generateCollectionUrl(0, limit),
                previous: generatePreviousUrl(offset, limit),
                next: generateNextUrl(offset, limit, totalNumberOfItems),
                last: generateCollectionUrl(getLastOffset(limit, totalNumberofItems), limit),
            });
    }
}

function generateCollectionUrl(baseUrl, offset, limit){
    return baseUrl + '?offset=' + 0 + '&limit=' + limit;
}

function generatePreviousUrl(offset, limit){
    var calculatedOffset = offset - limit;
    return calculatedOffset > 0 ?
        generateCollectionUrl(calculatedOffset, limit)
        : '';
}

function generateNextUrl(offset, limit, totalNumberOfItems){
    var calculatedOffset = offset + limit;
    return calculatedOffset < totalNumberOfItems ?
        generateCollectionUrl(calculatedOffset, limit)
        : '';
}

function getLastOffset(limit, totalNumberOfItems){
    var numberOfPages = Math.floor(totalNumberOfItems, limit);
    return numberOfPages * limit;
}

function getItems(records){
    var items = [];
    for(record in records){
        items.push({href: baseUrl + '/' + record.uuid})
    }
    return items;
}

module.exports = CollectionController;