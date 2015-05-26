global.__root = __dirname;
global.requireModule = function(name){
	return require(__dirname + '/lib/' + name);
};

var app = requireModule('app');
var config = requireModule('config');

app.launch(config.port);
