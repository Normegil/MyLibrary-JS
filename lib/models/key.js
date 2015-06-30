'use strict';

var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var KeySchema = new Schema({
	_id: { type: String, default: function genUUID(){
		return uuid.v4();
	}},
	name: String,
	public: String,
	private: String
});

module.exports = mongoose.model('Key', KeySchema);
module.exports.Schema = KeySchema;
