'use strict';

var u = require('underscore');

var CSV = requireModule('csv');
var log = requireModule('logger');
var config = requireModule('config');
var h = requireModule('helper');

function handle(request, response, code, error){
	log.warn(code + ' - ' + error);
	response.status(code);

	CSV.parse(__dirname + '/resources/RestErrors.csv', function(err, errorTable){
		if(err) {
			log.error('Error while parsing error file');
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
			var errors = u.filter(errorTable, function(errorLine){ return errorLine[0] === code.toString()});
			if(errors.length === 0){
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
				log.error('Error while parsing error file');
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
};

function generateError(code, httpStatus, moreInfoUri, message, developerMessage, request){
	var toSend;
	if(request !== undefined){
		 toSend = {
			url: h.request.getFullUrl(request),
			method: request.method
		};
	}
	return {
		code: code,
		httpStatus: httpStatus,
		moreInfoUri: moreInfoUri,
		message: message,
		developerMessage:developerMessage,
		request: toSend,
		time: new Date().toISOString()
	};
}

function generateControllerError(response, message, developerMessage, originalCode, originalError, request){
	var responseBody = generateError(
		50000,
		500,
		'',
		message,
		developerMessage,
		request
	);
	responseBody.originalCode = originalCode;
	responseBody.originalError = originalError;
	return responseBody;
}

module.exports.handle = handle;
