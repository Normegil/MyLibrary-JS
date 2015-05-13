function getArrayOfIndex(size){
	var index = [];
	for(var i = 0;i< size ;i++){
		index.push(i);
	}
	return index;
}

function getRandomInteger(upperLimit){
	var integer = Math.floor(Math.random() * upperLimit);
	return integer;
}

function getRandomBoolean(){
	var integer = getRandomInteger(2);
	return integer > 0 ?
		true
		: false;
}

function getAsInteger(actualValue){
	if(typeof actualValue === 'string' || actualValue instanceof String){
		return parseInt(actualValue);
	} else return actualValue;
}

function getAsBoolean(actualValue){
	if(typeof actualValue === 'string' || actualValue instanceof String){
		if(actualValue === 'true'){
			return true;
		}else if(actualValue === 'false'){
			return false;
		}else{
			throw new Error(actualValue + 'is not a boolean');
		}
	} else return actualValue;
}

module.exports.getArrayOfIndex = getArrayOfIndex;
module.exports.getRandomInteger = getRandomInteger;
module.exports.getRandomBoolean = getRandomBoolean;
module.exports.getAsInteger = getAsInteger;
module.exports.getAsBoolean = getAsBoolean;
