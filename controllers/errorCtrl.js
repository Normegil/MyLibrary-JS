'use strict';
var CSV = require('../helpers/CSV');
var log = require('../logger');

var errorCtrl = {
	handle: function(response, code, error){
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
					error
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
							error === 5000 ? error : line[4]
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
						error
					);

					response.json(responseBody);
        }
      }
		});
	}
};

function generateError(code, httpStatus, moreInfoUri, message, developerMessage){
	return {
		code: code,
		httpStatus: httpStatus,
		moreInfoUri: moreInfoUri,
		message: message,
		developerMessage:developerMessage,
		time: new Date().toISOString()
	};
}

function generateControllerError(response, message, developerMessage, originalCode, originalError){
	var responseBody = generateError(
		50000,
		500,
		'',
		message,
		developerMessage
	);
	responseBody.originalCode = originalCode;
	responseBody.originalError = originalError;
	return responseBody;
}

module.exports = errorCtrl;
