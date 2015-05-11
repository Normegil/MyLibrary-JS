var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var MangaSchema = new Schema({
	_id: { type: String, default: function genUUID(){
			return uuid.v4();
	}},
	name: String
});

module.exports = mongoose.model('Manga', MangaSchema);
module.exports.Schema = MangaSchema;
