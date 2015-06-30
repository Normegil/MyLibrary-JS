'use strict';

var _ = require('underscore');

var CSV = requireModule('csv');
var log = requireModule('logger').rest;
var h = requireModule('helper');

function handle(request, response, err){
	var code = err.code;
	var error = err.error;

	log.info({err: err}, "Building error response: " + code);
	response.status(code);
	var errorDescriptionFilePath = __dirname + '/resources/RestErrors.csv';
  log.info("Parse error description file: " + errorDescriptionFilePath);
	CSV.parse(errorDescriptionFilePath, function(err, errorTable){
		if(err) {
			log.error({err: err}, 'Error while parsing error file');
			response
				.status(500)
				.json(generateControllerError(
					response,
					'Error on server side (Cannot generate client error info)',
					'An error happened on server side while parsing the Error reference file',
					code,
					error,
					request
				));
		} else {
			var errors = _.filter(errorTable, function(errorLine){ return errorLine[0] === code.toString()});
			if(errors.length === 0){
				log.error({err: err, errorFilePath: errorDescriptionFilePath}, "Cannot find error code in error description file: " + code);
				response
					.status(500)
					.json(generateControllerError(
						response,
						'Error on server side (Cannot generate client error info)',
						'An error happened on server side - Error code not recognized: ' + code,
						code,
						error,
						request
					));
			}else if(errors.length === 1){
				var line = errors[0];
				response
					.status(h.getAsInteger(line[1]))
					.json(generateError(
						code,
						line[1],
						line[2],
						line[3],
						error === 5000 ? error : line[4],
						request
					));
			}else{
				log.error({err: err, errorFilePath: errorDescriptionFilePath}, "Duplicate error code in error description file: " + code);
				response
					.status(500)
					.json(generateControllerError(
						response,
						'Error on server side (Cannot generate client error info)',
						'An error happened on server side while parsing the Error reference file: duplicate code key:' + code,
						code,
						error,
						request
					));
			}
		}
	});
}

function generateError(errorBodyOptions){
	var toSend;
	if(errorBodyOptions.request !== undefined){
		 toSend = {
			url: h.request.getFullUrl(errorBodyOptions.request),
			method: errorBodyOptions.request.method
		};
	}
	var errorResponseBody = {
		code: errorBodyOptions.code,
		httpStatus: errorBodyOptions.httpStatus,
		moreInfoUri: errorBodyOptions.moreInfoUri,
		message: errorBodyOptions.message,
		developerMessage:errorBodyOptions.developerMessage,
		request: toSend,
		time: new Date().toISOString()
	};
	log.debug({response: errorResponseBody}, 'Error response body built');
	return errorResponseBody;
}

function generateControllerError(errorBodyOptions){
	var responseBody = generateError({
		code: 50000,
		httpStatus: 500,
		moreInfoUrl: '',
		message: errorBodyOptions.message,
		developerMessage: errorBodyOptions.developerMessage,
		request: errorBodyOptions.request
	});
	responseBody.original = {
		code: errorBodyOptions.original.code,
		error: errorBodyOptions.original.error,
	};
	log.debug({response: responseBody}, 'Error response body extended with original code/error');
	return responseBody;
}

module.exports.handle = handle;
