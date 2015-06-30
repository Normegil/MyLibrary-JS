'use strict';

var validator = require('validator');
var config = requireModule('config');
var h = require('./generic.js');

function getFullUrl(request){
	return getFullUrlWithOriginalUrl(request, request.originalUrl);
}

function getFullUrlWithOriginalUrl(request, originalUrl){
	return request.protocol + '://' + request.get('Host') + originalUrl;
}

function getFullUrlSkippingParameters(request){
	return getFullUrlWithOriginalUrl(request, getRequestedResourcePath(request));
}

function getRequestedResourcePath(request){
  var splittedUrl = request.originalUrl.split('?');
	var possibleUUID = splittedUrl[0].split('/').pop();
  return validator.isUUID(possibleUUID) ?
		splittedUrl[0].substr(0, splittedUrl[0].lastIndexOf('/'))
		: splittedUrl[0];
}

function getOffset(request){
	var limit = request.query.offset || 0;
	return h.getAsInteger(limit);
}

function getLimit(request){
	var limit = request.query.limit || config.rest.collections.defaultLimit;
	limit = h.getAsInteger(limit);
	if(limit > config.rest.collections.maxLimit){
		limit = config.rest.collections.maxLimit;
	}
	return limit;
}

function getLinksOnly(request){
	var linksOnly = request.query.linksOnly || false;
	return h.getAsBoolean(linksOnly);
}

module.exports = {
	getFullUrl: getFullUrl,
	getFullUrlSkippingParameters: getFullUrlSkippingParameters,
	getRequestedResourcePath: getRequestedResourcePath,
	getOffset: getOffset,
	getLimit: getLimit,
	getLinksOnly: getLinksOnly,
};
