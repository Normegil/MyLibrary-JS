var mongoose = require('mongoose');
var uuid = require('node-uuid');
var UserSchema = require('./user').Schema;

var Schema = mongoose.Schema;
var GroupSchema = new Schema({
	_id: { type: String, default: function genUUID(){
			return uuid.v4();
	}},
    name:String,
    access:[{
        path: String,
        method: String,
    }],
    users: [UserSchema]
});

module.exports = mongoose.model('Group', GroupSchema);
module.exports.Schema = GroupSchema;
