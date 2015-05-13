var validator = require('validator');
var helper = require('./helper.js');
var config = require('../config.js');

function geFullUrlWithOriginalUrl(request, originalUrl){
	return request.protocol + '://' + request.get('Host') + originalUrl;
}

function geFullUrl(request){
	return geFullUrlWithOriginalUrl(request, request.originalUrl);
}

function geFullUrlSkippingParameters(request){
	return geFullUrlWithOriginalUrl(request, getRequestedResourcePath(request));
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
	return helper.getAsInteger(limit);
}

function getLimit(request){
	var limit = request.query.limit || config.rest.collections.defaultLimit;
	limit = helper.getAsInteger(limit);
	if(limit > config.rest.collections.maxLimit){
		limit = config.rest.collections.maxLimit;
	}
	return limit;
}

function getLinksOnly(request){
	var linksOnly = request.query.linksOnly || false;
	return helper.getAsBoolean(linksOnly);
}

module.exports.geFullUrl = geFullUrl;
module.exports.geFullUrlSkippingParameters = geFullUrlSkippingParameters;
module.exports.getRequestedResourcePath = getRequestedResourcePath;
module.exports.getOffset = getOffset;
module.exports.getLimit = getLimit;
module.exports.getLinksOnly = getLinksOnly;
