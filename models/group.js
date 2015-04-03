var mongoose = require('mongoose');
var User = require('./user');

var Schema = mongoose.Schema;
var GroupSchema = new Schema({
	id: String,
    name:String,
    access:[{
        path: String,
        method: String,
    }],
    users:[User]
});

module.exports = mongoose.model('Group', GroupSchema);