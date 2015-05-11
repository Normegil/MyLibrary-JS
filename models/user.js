var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	_id: { type: String, default: function genUUID(){
		return uuid.v4();
	}},
	pseudo: String,
		hashedPassword: String,
		access:[{
			path:String,
			method:String
		}],
});

module.exports = mongoose.model('User', UserSchema);
module.exports.Schema = UserSchema;
