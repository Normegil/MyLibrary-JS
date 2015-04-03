var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KeySchema = new Schema({
	name: String,
    public: String,
    private: String
});

module.exports = mongoose.model('Key', KeySchema);