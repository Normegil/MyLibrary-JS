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

module.exports.getArrayOfIndex = getArrayOfIndex;
module.exports.getRandomInteger = getRandomInteger;
module.exports.getRandomBoolean = getRandomBoolean;
