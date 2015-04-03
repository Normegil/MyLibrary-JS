var csvParser = require('../helpers/csvParser');

var errorCtrl = {
	handle: function(response, code, error){
		console.log(code + ' - ' + error);
		response.status(code);

		csvParser.parse('./ressources/RestErrors.csv', function(error, errorTable){
			if(error){
                throw error;
            }else{
                var found = false;
                for(var i=0; i < errorTable.length; i++){
				    if(errorTable[i][0] === code.toString()){
					   var line = errorTable[i];
                        found = true;
					   response
						  .json({
                            code: code,
							httpStatus: line[1],
							moreInfoUri: line[2],
							message: line[3],
							developerMessage: 
                                error === 5000?
                                    error
                                    :line[4],
							time: new Date().toISOString()
						});
                        break;
				    }
                }
                if(!found){
                    response.send('Error message not found');
                }
            }
		});

	}
}

module.exports = errorCtrl;
