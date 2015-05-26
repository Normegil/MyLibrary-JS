var request = require('./request.js');
var generic = require('./generic.js');

module.exports = {
	exist: generic.exist,
	getArrayOfIndex: generic.getArrayOfIndex,
	getRandomInteger: generic.getRandomInteger,
	getRandomBoolean: generic.getRandomBoolean,
	getAsInteger: generic.getAsInteger,
	getAsBoolean: generic.getAsBoolean,
	request: request
};
