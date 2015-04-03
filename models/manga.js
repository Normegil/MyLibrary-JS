var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MangaSchema = new Schema({
	uuid: String,
	name: String
});

module.exports = mongoose.model('Manga', MangaSchema);
