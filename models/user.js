var mongoose = require('mongoose');
var Group = require('./group');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	id: String,
	pseudo: String,
    hashedPassword: String,
    access:[{
        path:String,
    }],
    groups:[Group]
});

module.exports = mongoose.model('User', UserSchema);
