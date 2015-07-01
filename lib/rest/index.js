'use strict';

var collection = require('./collectionCtrl.js');
var error = require('./errorCtrl.js');
var httpStatus = require('./httpStatus.js');

module.exports = {
  collection: collection,
  error: error,
  status: httpStatus,
};
