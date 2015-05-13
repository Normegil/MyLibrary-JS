'use strict';
var CSV = require('../helpers/CSV');
var log = require('../logger.js');
var config = require('../config.js');
var requestHelper = require('../helpers/request.js')

var errorCtrl = {
	handle: function(response, code, error, request){
		log.info(code + ' - ' + error);
		response.status(code);

		CSV.parse('./resources/RestErrors.csv', function(err, errorTable){
			if(err) {
				log.error('Error while parsing error file');
				response.status(500);
				var responseBody = generateControllerError(
					response,
					'Error on server side (Cannot generate client error info)',
					'An error happened on server side while parsing the Error reference file',
					code,
					error,
					request
				);
				response.json(responseBody);
      } else {
      	var found = false;
        for(var i=0; i < errorTable.length; i++){
	    		if(errorTable[i][0] === code.toString()){
		   			var line = errorTable[i];
						found = true;
						response.json(generateError(
							code,
							line[1],
							line[2],
							line[3],
							error === 5000 ? error : line[4],
							request
						));
		   			break;
	    		}
        }
        if(!found){
					response.status(500);
					var responseBody = generateControllerError(
						response,
						'Error on server side (Cannot generate client error info)',
						'An error happened on server side - Error code not recognized',
						code,
						error,
						request
					);

					response.json(responseBody);
        }
      }
		});
	}
};

function generateError(code, httpStatus, moreInfoUri, message, developerMessage, request){
	var toSend;
	if(request !== undefined){
		 toSend = {
			url: requestHelper.geFullUrl(request),
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

module.exports = errorCtrl;
