'use strict';

var mongoose = require('mongoose');
var h = requireModule('helper');
var Schema = mongoose.Schema;

var KeySchema = new Schema({
  _id: {type: String, default: h.generateUUID},
  name: String,
  public: String,
  private: String,
});

module.exports = mongoose.model('Key', KeySchema);
module.exports.Schema = KeySchema;
