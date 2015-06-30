'use strict';

var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var BookSerieSchema = new Schema({
	_id: { type: String, default: function genUUID(){
			return uuid.v4();
	}},

	isbn: String,

	title: String,
	alternativeTitles: [String],

	description: String,

	tags: [String],

	urls: [{
		_id: { type: String, default: function genUUID(){
				return uuid.v4();
		}},
		website: String,
		url: String
	}],

	books: [{
		_id: { type: String, default: function genUUID(){
				return uuid.v4();
		}},
		isbn: String,
		title: String,
		alternativeTitles: [String],
		authors: [String],
		description: String,
		genres: [String],
		tags: [String],
		releaseDate: Date
	}],

	status: String
});

module.exports = mongoose.model('BookSerie', BookSerieSchema);
module.exports.Schema = BookSerieSchema;
