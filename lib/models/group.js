'use strict';

var mongoose = require('mongoose');
var h = requireModule('helper');
var UserSchema = require('./user').Schema;

var Schema = mongoose.Schema;
var GroupSchema = new Schema({
  _id: {type: String, default: h.generateUUID},
  name: String,
  access: [
    {
      path: String,
      method: String,
    },
  ],
  users: [UserSchema],
});

module.exports = mongoose.model('Group', GroupSchema);
module.exports.Schema = GroupSchema;
