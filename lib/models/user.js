'use strict';

var mongoose = require('mongoose');
var h = requireModule('helper');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  _id: {type: String, default: h.generateUUID},
  pseudo: String,
  hashedPassword: String,
  access: [
    {
      path: String,
      method: String,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
module.exports.Schema = UserSchema;
