var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
	_id: { type: String, default: function genUUID(){
			return uuid.v4();
	}},

	isbn: String,

	title: String,
	alternativeTitles: [String],

	authors: [String],

	genres: [String],

	tags: [String],

	urls: [{
		type: String,
		url: String
	}],

	releaseDate: Date
});

module.exports = mongoose.model('Book', BookSchema);
module.exports.Schema = BookSchema;
