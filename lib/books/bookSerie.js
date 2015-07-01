'use strict';
var mongoose = require('mongoose');
var h = requireModule('helper');
var Schema = mongoose.Schema;

var BookSerieSchema = new Schema({
  _id: {type: String, default: h.generateUUID},

  isbn: String,

  title: String,
  alternativeTitles: [String],

  description: String,

  tags: [String],

  urls: [
    {
      _id: {type: String, default: h.generateUUID},
      website: String,
      url: String,
    },
  ],

  books: [
    {
      _id: {type: String, default: h.generateUUID},
      isbn: String,
      title: String,
      alternativeTitles: [String],
      authors: [String],
      description: String,
      genres: [String],
      tags: [String],
      releaseDate: Date,
    },
  ],

  status: String,
});

module.exports = mongoose.model('BookSerie', BookSerieSchema);
module.exports.Schema = BookSerieSchema;
