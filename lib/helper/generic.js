'use strict';
var uuid = require('node-uuid');

function generateUUID() {
  return uuid.v4();
}

function exist(object) {
  return undefined !== object && null !== object;
}

function getArrayOfIndex(size) {
  var index = [];
  for (var i = 0;i < size;i++) {
    index.push(i);
  }
  return index;
}

function getRandomInteger(upperLimit) {
  var integer = Math.floor(Math.random() * upperLimit);
  return integer;
}

function getRandomBoolean() {
  var integer = getRandomInteger(2);
  return 0 < integer ?
    true
    : false;
}

function getAsInteger(actualValue) {
  if ('string' === typeof actualValue || actualValue instanceof String) {
    return parseInt(actualValue);
  } else {
    return actualValue;
  }
}

function getAsBoolean(actualValue) {
  if ('string' === typeof actualValue || actualValue instanceof String) {
    if ('true' === actualValue) {
      return true;
    } else if ('false' === actualValue) {
      return false;
    } else {
      throw new Error(actualValue + 'is not a boolean');
    }
  } else {
    return actualValue;
  }
}

module.exports = {
  exist: exist,
  getArrayOfIndex: getArrayOfIndex,
  getRandomInteger: getRandomInteger,
  getRandomBoolean: getRandomBoolean,
  getAsInteger: getAsInteger,
  getAsBoolean: getAsBoolean,
  generateUUID: generateUUID,
};
